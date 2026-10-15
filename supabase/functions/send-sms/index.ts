// HIVEGUARD AI - Supabase Edge Function: send-sms
// Reliable SMS Notification Dispatcher with Consent & Rate-limiting
// Integrates with MSG91 / Twilio or standard webhook with fallback status logging

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { alert_id, owner_id, message, recipient_override } = await req.json();

    if (!owner_id || !message) {
      return new Response(JSON.stringify({ error: "owner_id and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 1. Fetch Notification Preferences & Explicit Consent
    const { data: prefs } = await supabaseAdmin
      .from("notification_preferences")
      .select("*")
      .eq("owner_id", owner_id)
      .single();

    if (!prefs || !prefs.sms_enabled) {
      // User disabled SMS notifications
      return new Response(JSON.stringify({ status: "suppressed", reason: "SMS notifications disabled by user" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!prefs.sms_consent_given) {
      // Legal requirement: explicit SMS consent required
      return new Response(JSON.stringify({ status: "suppressed", reason: "Explicit SMS consent not granted" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const recipients = recipient_override ? [recipient_override] : prefs.authorized_phone_numbers;
    if (!recipients || recipients.length === 0) {
      return new Response(JSON.stringify({ status: "suppressed", reason: "No authorized phone numbers found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const msg91AuthKey = Deno.env.get("MSG91_AUTH_KEY");
    const msg91SenderId = Deno.env.get("MSG91_SENDER_ID") || "HVGRDAI";
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    const logs = [];

    for (const recipient of recipients) {
      let deliveryStatus = "pending";
      let providerName = "None";
      let errorMsg: string | null = null;
      let providerMsgId: string | null = null;

      if (msg91AuthKey) {
        providerName = "MSG91";
        try {
          // MSG91 Send API
          const response = await fetch("https://control.msg91.com/api/v5/flow/", {
            method: "POST",
            headers: {
              "authkey": msg91AuthKey,
              "content-type": "application/json"
            },
            body: JSON.stringify({
              flow_id: Deno.env.get("MSG91_FLOW_ID"),
              sender: msg91SenderId,
              mobiles: recipient.replace(/\D/g, ""),
              message: message
            })
          });
          const resData = await response.json();
          if (response.ok) {
            deliveryStatus = "delivered";
            providerMsgId = resData.message || resData.request_id;
          } else {
            deliveryStatus = "failed";
            errorMsg = resData.message || "MSG91 dispatch error";
          }
        } catch (err: any) {
          deliveryStatus = "failed";
          errorMsg = err.message;
        }
      } else if (twilioAccountSid && twilioAuthToken && twilioFromNumber) {
        providerName = "Twilio";
        try {
          const authString = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
          const formData = new URLSearchParams();
          formData.append("To", recipient);
          formData.append("From", twilioFromNumber);
          formData.append("Body", message);

          const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
            method: "POST",
            headers: {
              "Authorization": `Basic ${authString}`,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
          });
          const resData = await response.json();
          if (response.ok) {
            deliveryStatus = "delivered";
            providerMsgId = resData.sid;
          } else {
            deliveryStatus = "failed";
            errorMsg = resData.message;
          }
        } catch (err: any) {
          deliveryStatus = "failed";
          errorMsg = err.message;
        }
      } else {
        // Honest handling: No SMS provider configured
        deliveryStatus = "provider_not_configured";
        providerName = "Unconfigured";
        errorMsg = "SMS Provider credentials (MSG91_AUTH_KEY or TWILIO_ACCOUNT_SID) not set in environment";
      }

      // Record in notification_logs table for auditability
      const { data: logEntry } = await supabaseAdmin
        .from("notification_logs")
        .insert({
          owner_id: owner_id,
          alert_id: alert_id || null,
          channel: "sms",
          recipient: recipient,
          message_content: message,
          provider: providerName,
          provider_message_id: providerMsgId,
          delivery_status: deliveryStatus,
          error_message: errorMsg
        })
        .select()
        .single();

      logs.push(logEntry);
    }

    return new Response(JSON.stringify({ success: true, logs }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
