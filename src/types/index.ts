// HIVEGUARD AI - TypeScript Data Interfaces

export type HiveStatus = 'active' | 'quarantined' | 'archived' | 'inactive';
export type ConnectionStatus = 'online' | 'offline' | 'warning';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type AlertType =
  | 'temperature_warning'
  | 'critical_temperature'
  | 'humidity_anomaly'
  | 'unusual_bee_activity'
  | 'weight_loss_swarm'
  | 'parasite_concern'
  | 'device_offline'
  | 'sensor_malfunction'
  | 'low_battery'
  | 'subscription_alert';

export type RiskLevel = 'normal' | 'warning' | 'high_risk' | 'insufficient_data';
export type AssessmentMethod = 'rule_based' | 'ai_ml_model' | 'hybrid';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  organization?: string;
  created_at: string;
}

export interface Apiary {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  hive_count?: number;
  created_at: string;
}

export interface Hive {
  id: string;
  apiary_id: string;
  apiary_name?: string;
  owner_id: string;
  hive_code: string;
  name: string;
  bee_species: string;
  installation_date: string;
  status: HiveStatus;
  notes?: string;
  created_at: string;
  current_reading?: SensorReading;
  device?: IoTDevice;
  active_alerts_count?: number;
  risk_level?: RiskLevel;
}

export interface IoTDevice {
  id: string;
  hive_id?: string;
  owner_id: string;
  device_code: string;
  firmware_version: string;
  battery_level: number;
  signal_strength: number; // in dBm, e.g. -65
  last_seen_at?: string;
  connection_status: ConnectionStatus;
  is_simulated: boolean;
  created_at: string;
}

export interface SensorReading {
  id: string;
  hive_id: string;
  device_id?: string;
  temperature_c: number;
  humidity_percent: number;
  weight_kg?: number;
  activity_count?: number;
  battery_percent?: number;
  is_simulated: boolean;
  recorded_at: string;
}

export interface AlertSettings {
  id: string;
  owner_id: string;
  hive_id: string;
  temperature_warning: number;
  temperature_critical: number;
  temperature_min: number;
  humidity_min: number;
  humidity_max: number;
  humidity_critical_min?: number;
  humidity_critical_max?: number;
  weight_drop_threshold_kg?: number;
  persistence_minutes: number;
  cooldown_minutes: number;
}

export interface AlertItem {
  id: string;
  owner_id: string;
  hive_id: string;
  hive_code: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  measured_value?: number;
  threshold_value?: number;
  status: AlertStatus;
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  owner_id: string;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  authorized_phone_numbers: string[];
  alert_preferences: {
    temperature: boolean;
    humidity: boolean;
    parasites: boolean;
    device: boolean;
    billing: boolean;
  };
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  sms_consent_given: boolean;
  consent_updated_at: string;
}

export interface NotificationLog {
  id: string;
  owner_id: string;
  alert_id?: string;
  channel: 'sms' | 'in_app' | 'email';
  recipient: string;
  message_content: string;
  provider: string;
  provider_message_id?: string;
  delivery_status: 'pending' | 'delivered' | 'failed' | 'suppressed' | 'provider_not_configured';
  error_message?: string;
  created_at: string;
}

export interface Inspection {
  id: string;
  owner_id: string;
  hive_id: string;
  hive_code?: string;
  inspection_date: string;
  inspector_name: string;
  queen_spotted: boolean;
  brood_pattern: 'excellent' | 'solid' | 'spotty' | 'no_brood';
  food_stores: 'heavy' | 'adequate' | 'light' | 'starving';
  temperament: 'calm' | 'nervous' | 'aggressive';
  notes?: string;
  follow_up_date?: string;
  created_at: string;
}

export interface ParasiteObservation {
  id: string;
  owner_id: string;
  hive_id: string;
  hive_code?: string;
  parasite_type: string;
  observation_method: 'alcohol_wash' | 'sugar_shake' | 'sticky_board' | 'visual_inspection' | 'ai_vision';
  mite_count: number;
  sample_size: number;
  infestation_rate_pct: number;
  image_path?: string;
  model_result?: {
    detected_mites_count: number;
    confidence: number;
    candidate_boxes?: Array<{ x: number; y: number; width: number; height: number; score: number }>;
  };
  beekeeper_confirmed: boolean;
  treatment_applied?: string;
  observed_at: string;
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  owner_id: string;
  hive_id: string;
  hive_code?: string;
  risk_level: RiskLevel;
  assessment_method: AssessmentMethod;
  confidence_score?: number;
  summary: string;
  contributing_factors: string[];
  recommended_actions: string[];
  assessed_at: string;
}

export interface SubscriptionPlan {
  id: string;
  plan_code: 'monthly_standard' | 'yearly_best_value';
  plan_name: string;
  price_inr: number;
  billing_interval: 'monthly' | 'yearly';
  monthly_equivalent_inr: number;
  annual_savings_inr: number;
  savings_percentage: number;
  entitlements: {
    max_hives: number;
    sms_per_month: number;
    sensor_interval_sec: number;
    ai_risk_analysis: boolean;
    csv_export: boolean;
    data_retention_days: number;
    priority_support?: boolean;
  };
  active: boolean;
}

export interface UserSubscription {
  id: string;
  owner_id: string;
  plan_id: string;
  plan?: SubscriptionPlan;
  provider_subscription_id?: string;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  start_date: string;
  renewal_date: string;
  created_at: string;
}

export interface PaymentItem {
  id: string;
  owner_id: string;
  subscription_id?: string;
  provider_payment_id: string;
  amount_inr: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  invoice_number: string;
  paid_at: string;
}
