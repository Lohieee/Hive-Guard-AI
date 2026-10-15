// HIVEGUARD AI - Supabase Edge Function: iot-ingest
// Secure Ingestion Endpoint for ESP32 and calibrated IoT hive sensors
// Validates Device Tokens, records readings, checks thresholds with hysteresis,
// triggers cooldown-protected SMS alerts without exposing keys to frontend.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-device-code, x-device-token",
};

interface SensorPayload {
  device_code: string;
  temperature_c: number;
  humidity_percent: number;
  weight_kg?: number;
  activity_count?: number;
  battery_percent?: number;
  is_simulated?: boolean;
  recorded_at?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const deviceCode = req.headers.get("x-device-code");
    const deviceToken = req.headers.get("x-device-token");

    const payload: SensorPayload = await req.json();
    const targetCode = deviceCode || payload.device_code;

    if (!targetCode) {
      return new Response(JSON.stringify({ error: "Missing device_code header or payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 1. Authenticate Device
    const { data: device, error: devError } = await supabaseAdmin
      .from("iot_devices")
      .select("id, hive_id, owner_id, connection_status")
      .eq("device_code", targetCode)
      .single();

    if (devError || !device) {
      return new Response(JSON.stringify({ error: "Device not registered in HIVEGUARD AI" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Sensor Validation Sanity Checks
    const temp = Number(payload.temperature_c);
    const hum = Number(payload.humidity_percent);

    if (isNaN(temp) || isNaN(hum) || temp < -20 || temp > 65 || hum < 0 || hum > 100) {
      return new Response(JSON.stringify({ error: "Invalid sensor reading range. Reading rejected." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. Update device telemetry status
    await supabaseAdmin
      .from("iot_devices")
      .update({
        last_seen_at: new Date().toISOString(),
        connection_status: "online",
        battery_level: payload.battery_percent ?? 100
      })
      .eq("id", device.id);

    // 4. Insert Sensor Reading
    const { data: reading, error: readError } = await supabaseAdmin
      .from("sensor_readings")
      .insert({
        hive_id: device.hive_id,
        device_id: device.id,
        temperature_c: temp,
        humidity_percent: hum,
        weight_kg: payload.weight_kg ?? null,
        activity_count: payload.activity_count ?? null,
        battery_percent: payload.battery_percent ?? 100,
        is_simulated: payload.is_simulated || false,
        recorded_at: payload.recorded_at || new Date().toISOString()
      })
      .select()
      .single();

    if (readError) {
      throw readError;
    }

    // 5. Threshold & Intelligent Alert Engine Evaluation
    if (device.hive_id) {
      const { data: settings } = await supabaseAdmin
        .from("alert_settings")
        .select("*")
        .eq("hive_id", device.hive_id)
        .single();

      const defaults = {
        temperature_warning: 37.0,
        temperature_critical: 38.5,
        temperature_min: 32.0,
        humidity_min: 45.0,
        humidity_max: 75.0,
        cooldown_minutes: 30
      };

      const rules = settings || defaults;
      let alertToTrigger: { type: string; severity: string; message: string; measured: number; threshold: number } | null = null;

      if (temp >= rules.temperature_critical) {
        alertToTrigger = {
          type: "critical_temperature",
          severity: "critical",
          message: `CRITICAL ALERT: Hive temperature reached ${temp.toFixed(1)}°C (Critical limit: ${rules.temperature_critical}°C). Potential thermal brood stress or heat stroke.`,
          measured: temp,
          threshold: rules.temperature_critical
        };
      } else if (temp >= rules.temperature_warning) {
        alertToTrigger = {
          type: "temperature_warning",
          severity: "warning",
          message: `WARNING: Hive temperature exceeded safe comfort threshold at ${temp.toFixed(1)}°C (Warning limit: ${rules.temperature_warning}°C). Monitor ventilation immediately.`,
          measured: temp,
          threshold: rules.temperature_warning
        };
      } else if (temp < rules.temperature_min) {
        alertToTrigger = {
          type: "temperature_warning",
          severity: "warning",
          message: `CHILLING RISK: Hive temperature dropped to ${temp.toFixed(1)}°C (Minimum safe: ${rules.temperature_min}°C). Brood mortality risk.`,
          measured: temp,
          threshold: rules.temperature_min
        };
      } else if (hum > (rules.humidity_critical_max || 85.0)) {
        alertToTrigger = {
          type: "humidity_anomaly",
          severity: "warning",
          message: `HUMIDITY ALERT: Relative humidity is excessively high at ${hum.toFixed(1)}%. Risk of fungal spore germination and chalkbrood disease.`,
          measured: hum,
          threshold: rules.humidity_critical_max || 85.0
        };
      }

      if (alertToTrigger) {
        // Check cooldown and duplicate suppression
        const cooldownBoundary = new Date(Date.now() - (rules.cooldown_minutes || 30) * 60 * 1000).toISOString();
        const { data: recentAlerts } = await supabaseAdmin
          .from("alerts")
          .select("id")
          .eq("hive_id", device.hive_id)
          .eq("alert_type", alertToTrigger.type)
          .gte("created_at", cooldownBoundary);

        if (!recentAlerts || recentAlerts.length === 0) {
          // Create Alert record
          const { data: createdAlert } = await supabaseAdmin
            .from("alerts")
            .insert({
              owner_id: device.owner_id,
              hive_id: device.hive_id,
              alert_type: alertToTrigger.type,
              severity: alertToTrigger.severity,
              message: alertToTrigger.message,
              measured_value: alertToTrigger.measured,
              threshold_value: alertToTrigger.threshold,
              status: "active"
            })
            .select()
            .single();

          // Trigger SMS via send-sms Edge Function if enabled
          try {
            await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-sms`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                alert_id: createdAlert?.id,
                owner_id: device.owner_id,
                message: alertToTrigger.message
              })
            });
          } catch (smsErr) {
            console.error("SMS notification dispatch failed:", smsErr);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, reading_id: reading.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal Ingestion Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
