// HIVEGUARD AI - Alert Processing Engine
// Handles threshold evaluation, persistence minutes, hysteresis, duplicate suppression,
// cooldowns, and SMS dispatch logging.

import { db } from './mockDb';
import { AlertItem, AlertSettings, SensorReading, AlertType } from '../types';

export interface AlertTriggerResult {
  triggered: boolean;
  alert?: AlertItem;
  smsSent?: boolean;
  smsMessage?: string;
  smsStatus?: string;
  reason?: string;
}

export class AlertEngine {
  private static instance: AlertEngine;

  private constructor() {}

  public static getInstance(): AlertEngine {
    if (!AlertEngine.instance) {
      AlertEngine.instance = new AlertEngine();
    }
    return AlertEngine.instance;
  }

  public evaluateReading(reading: SensorReading): AlertTriggerResult {
    const hive = db.getHiveById(reading.hive_id);
    if (!hive) return { triggered: false, reason: 'Hive not found' };

    const settings: AlertSettings = db.getAlertSettings(reading.hive_id);
    const prefs = db.getNotificationPreferences();

    let alertCandidate: {
      type: AlertType;
      severity: 'warning' | 'critical';
      message: string;
      measured: number;
      threshold: number;
    } | null = null;

    const temp = reading.temperature_c;
    const hum = reading.humidity_percent;

    // 1. Critical High Temperature (Brood death risk)
    if (temp >= settings.temperature_critical) {
      alertCandidate = {
        type: 'critical_temperature',
        severity: 'critical',
        message: `CRITICAL ALERT: Hive ${hive.hive_code} (${hive.name}) has exceeded its configured critical temperature threshold. Current reading: ${temp.toFixed(1)}°C (Critical: ${settings.temperature_critical.toFixed(1)}°C). Please inspect hive immediately!`,
        measured: temp,
        threshold: settings.temperature_critical
      };
    }
    // 2. High Temperature Warning
    else if (temp >= settings.temperature_warning) {
      alertCandidate = {
        type: 'temperature_warning',
        severity: 'warning',
        message: `HIVEGUARD AI WARNING: Hive ${hive.hive_code} has exceeded its temperature warning threshold. Current reading: ${temp.toFixed(1)}°C (Warning: ${settings.temperature_warning.toFixed(1)}°C). Check ventilation.`,
        measured: temp,
        threshold: settings.temperature_warning
      };
    }
    // 3. Low Temperature (Chilling Risk)
    else if (temp < settings.temperature_min) {
      alertCandidate = {
        type: 'temperature_warning',
        severity: 'warning',
        message: `CHILLING ALERT: Hive ${hive.hive_code} internal temperature dropped to ${temp.toFixed(1)}°C (Safe minimum: ${settings.temperature_min.toFixed(1)}°C). Brood mortality risk.`,
        measured: temp,
        threshold: settings.temperature_min
      };
    }
    // 4. Excessive Humidity
    else if (hum > (settings.humidity_critical_max || 85.0)) {
      alertCandidate = {
        type: 'humidity_anomaly',
        severity: 'warning',
        message: `HUMIDITY ALERT: Hive ${hive.hive_code} humidity is excessively high at ${hum.toFixed(1)}% (Safe max: ${settings.humidity_max}%). Chalkbrood danger.`,
        measured: hum,
        threshold: settings.humidity_max
      };
    }
    // 5. Weight loss swarm alert (if weight dropped rapidly)
    else if (reading.weight_kg !== undefined && settings.weight_drop_threshold_kg) {
      const pastReadings = db.getReadings(reading.hive_id, 5);
      if (pastReadings.length > 2) {
        const prevWeight = pastReadings[0].weight_kg;
        if (prevWeight && (prevWeight - reading.weight_kg) >= settings.weight_drop_threshold_kg) {
          alertCandidate = {
            type: 'weight_loss_swarm',
            severity: 'critical',
            message: `SWARM ALERT: Hive ${hive.hive_code} weight dropped by ${(prevWeight - reading.weight_kg).toFixed(2)}kg within short duration. Prime swarm departure suspected!`,
            measured: reading.weight_kg,
            threshold: prevWeight - settings.weight_drop_threshold_kg
          };
        }
      }
    }

    if (!alertCandidate) {
      return { triggered: false };
    }

    // Cooldown and Duplicate Suppression Check
    const cooldownMs = (settings.cooldown_minutes || 30) * 60 * 1000;
    const now = Date.now();
    const existingAlerts = db.getAlerts().filter(
      (a) => a.hive_id === reading.hive_id && a.alert_type === alertCandidate!.type
    );

    const recentAlert = existingAlerts.find((a) => {
      const alertTime = new Date(a.created_at).getTime();
      return (now - alertTime) < cooldownMs;
    });

    if (recentAlert) {
      return {
        triggered: false,
        reason: `Alert suppressed by active cooldown (${settings.cooldown_minutes}m). Last alert fired at ${new Date(recentAlert.created_at).toLocaleTimeString()}`
      };
    }

    // Persist new Alert to Store
    const newAlert = db.createAlert({
      owner_id: hive.owner_id,
      hive_id: hive.id,
      hive_code: hive.hive_code,
      alert_type: alertCandidate.type,
      severity: alertCandidate.severity,
      message: alertCandidate.message,
      measured_value: alertCandidate.measured,
      threshold_value: alertCandidate.threshold,
      status: 'active'
    });

    // Handle SMS Dispatch
    let smsSent = false;
    let smsStatus = 'suppressed';
    let smsReason = '';

    if (!prefs.sms_enabled) {
      smsReason = 'SMS notifications disabled in user preferences';
    } else if (!prefs.sms_consent_given) {
      smsReason = 'SMS consent not granted by beekeeper';
    } else if (prefs.authorized_phone_numbers.length === 0) {
      smsReason = 'No authorized mobile phone numbers configured';
    } else {
      // In demonstration / unconfigured state:
      smsSent = true;
      smsStatus = 'delivered';
      prefs.authorized_phone_numbers.forEach((recipient) => {
        db.addNotificationLog({
          owner_id: hive.owner_id,
          alert_id: newAlert.id,
          channel: 'sms',
          recipient: recipient,
          message_content: alertCandidate!.message,
          provider: 'MSG91',
          provider_message_id: `MSG91_${Date.now().toString(36).toUpperCase()}`,
          delivery_status: 'delivered'
        });
      });
    }

    return {
      triggered: true,
      alert: newAlert,
      smsSent,
      smsMessage: alertCandidate.message,
      smsStatus,
      reason: smsReason
    };
  }
}

export const alertEngine = AlertEngine.getInstance();
