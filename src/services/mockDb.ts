// HIVEGUARD AI - High-Fidelity Mock & Local Storage Relational Store
// Provides realistic pre-seeded data, persistence, and instant offline/demo capability.

import {
  UserProfile,
  Apiary,
  Hive,
  IoTDevice,
  SensorReading,
  AlertItem,
  AlertSettings,
  NotificationPreferences,
  NotificationLog,
  Inspection,
  ParasiteObservation,
  RiskAssessment,
  SubscriptionPlan,
  UserSubscription,
  PaymentItem
} from '../types';

const STORAGE_KEY = 'hiveguard_ai_db_v1';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_beekeeper_demo_01',
  email: 'ramesh.beekeeper@hiveguard.ai',
  full_name: 'Ramesh Patil',
  phone: '+919876543210',
  organization: 'Western Ghats Honey Cooperative',
  created_at: '2026-09-01T08:00:00Z',
};

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_monthly',
    plan_code: 'monthly_standard',
    plan_name: 'Flexible Monthly Plan',
    price_inr: 99.00,
    billing_interval: 'monthly',
    monthly_equivalent_inr: 99.00,
    annual_savings_inr: 0,
    savings_percentage: 0,
    entitlements: {
      max_hives: 10,
      sms_per_month: 50,
      sensor_interval_sec: 60,
      ai_risk_analysis: true,
      csv_export: true,
      data_retention_days: 90
    },
    active: true
  },
  {
    id: 'plan_yearly',
    plan_code: 'yearly_best_value',
    plan_name: 'Annual Colony Protector',
    price_inr: 999.00,
    billing_interval: 'yearly',
    monthly_equivalent_inr: 83.25,
    annual_savings_inr: 189.00,
    savings_percentage: 15.9,
    entitlements: {
      max_hives: 25,
      sms_per_month: 200,
      sensor_interval_sec: 30,
      ai_risk_analysis: true,
      csv_export: true,
      data_retention_days: 365,
      priority_support: true
    },
    active: true
  }
];

export const DEFAULT_APIARIES: Apiary[] = [
  {
    id: 'apiary_01',
    owner_id: DEFAULT_USER.id,
    name: 'Valley Bloom Apiary',
    location: 'Coorg Valley, Karnataka (Elev: 920m)',
    latitude: 12.3375,
    longitude: 75.8069,
    notes: 'Coffee blossom and multi-flora honey apiary with 12 colony capacity.',
    hive_count: 3,
    created_at: '2026-09-02T10:00:00Z'
  },
  {
    id: 'apiary_02',
    owner_id: DEFAULT_USER.id,
    name: 'Silver Oak Orchard',
    location: 'Chikmagalur Hills, Karnataka (Elev: 1050m)',
    latitude: 13.3153,
    longitude: 75.7754,
    notes: 'Shade-grown plantation perimeter. Monitored for monsoon dampness.',
    hive_count: 1,
    created_at: '2026-09-15T14:30:00Z'
  }
];

export const DEFAULT_HIVES: Hive[] = [
  {
    id: 'hive_01',
    apiary_id: 'apiary_01',
    apiary_name: 'Valley Bloom Apiary',
    owner_id: DEFAULT_USER.id,
    hive_code: 'HG-001',
    name: 'Golden Comb Alpha',
    bee_species: 'Apis cerana indica',
    installation_date: '2026-09-05',
    status: 'active',
    notes: 'Established 8-frame colony with strong queen. High pollen intake.',
    created_at: '2026-09-05T09:00:00Z'
  },
  {
    id: 'hive_02',
    apiary_id: 'apiary_01',
    apiary_name: 'Valley Bloom Apiary',
    owner_id: DEFAULT_USER.id,
    hive_code: 'HG-002',
    name: 'Amber Sentinel',
    bee_species: 'Apis mellifera',
    installation_date: '2026-09-10',
    status: 'active',
    notes: 'Italian lineage queen. Experimental entrance flight sensor installed.',
    created_at: '2026-09-10T11:00:00Z'
  },
  {
    id: 'hive_03',
    apiary_id: 'apiary_01',
    apiary_name: 'Valley Bloom Apiary',
    owner_id: DEFAULT_USER.id,
    hive_code: 'HG-003',
    name: 'Forest Dell Colony',
    bee_species: 'Apis cerana indica',
    installation_date: '2026-09-20',
    status: 'active',
    notes: 'Slightly damp corner under canopy. Temperature warning triggered yesterday.',
    created_at: '2026-09-20T16:00:00Z'
  },
  {
    id: 'hive_04',
    apiary_id: 'apiary_02',
    apiary_name: 'Silver Oak Orchard',
    owner_id: DEFAULT_USER.id,
    hive_code: 'HG-004',
    name: 'Highland Pioneer',
    bee_species: 'Apis mellifera',
    installation_date: '2026-09-25',
    status: 'active',
    notes: 'Experimental solar-powered node with cellular GSM fallback module.',
    created_at: '2026-09-25T13:00:00Z'
  }
];

export const DEFAULT_DEVICES: IoTDevice[] = [
  {
    id: 'dev_01',
    hive_id: 'hive_01',
    owner_id: DEFAULT_USER.id,
    device_code: 'ESP32-HG-001',
    firmware_version: 'v1.2.0',
    battery_level: 94,
    signal_strength: -62,
    last_seen_at: new Date().toISOString(),
    connection_status: 'online',
    is_simulated: false, // Live calibrated test node
    created_at: '2026-09-05T09:15:00Z'
  },
  {
    id: 'dev_02',
    hive_id: 'hive_02',
    owner_id: DEFAULT_USER.id,
    device_code: 'ESP32-HG-002',
    firmware_version: 'v1.2.0',
    battery_level: 88,
    signal_strength: -68,
    last_seen_at: new Date(Date.now() - 45000).toISOString(),
    connection_status: 'online',
    is_simulated: true,
    created_at: '2026-09-10T11:15:00Z'
  },
  {
    id: 'dev_03',
    hive_id: 'hive_03',
    owner_id: DEFAULT_USER.id,
    device_code: 'ESP32-HG-003',
    firmware_version: 'v1.1.8',
    battery_level: 42,
    signal_strength: -79,
    last_seen_at: new Date(Date.now() - 120000).toISOString(),
    connection_status: 'online',
    is_simulated: true,
    created_at: '2026-09-20T16:15:00Z'
  },
  {
    id: 'dev_04',
    hive_id: 'hive_04',
    owner_id: DEFAULT_USER.id,
    device_code: 'ESP32-HG-004',
    firmware_version: 'v1.2.0',
    battery_level: 97,
    signal_strength: -58,
    last_seen_at: new Date(Date.now() - 30000).toISOString(),
    connection_status: 'online',
    is_simulated: true,
    created_at: '2026-09-25T13:15:00Z'
  }
];

export const DEFAULT_ALERT_SETTINGS: AlertSettings[] = [
  {
    id: 'set_01',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_01',
    temperature_warning: 37.0,
    temperature_critical: 38.5,
    temperature_min: 32.0,
    humidity_min: 50.0,
    humidity_max: 75.0,
    humidity_critical_min: 35.0,
    humidity_critical_max: 85.0,
    weight_drop_threshold_kg: 1.5,
    persistence_minutes: 5,
    cooldown_minutes: 30
  },
  {
    id: 'set_02',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_02',
    temperature_warning: 36.8,
    temperature_critical: 38.2,
    temperature_min: 32.5,
    humidity_min: 48.0,
    humidity_max: 72.0,
    humidity_critical_min: 35.0,
    humidity_critical_max: 85.0,
    weight_drop_threshold_kg: 1.8,
    persistence_minutes: 5,
    cooldown_minutes: 30
  },
  {
    id: 'set_03',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_03',
    temperature_warning: 37.0,
    temperature_critical: 38.5,
    temperature_min: 32.0,
    humidity_min: 45.0,
    humidity_max: 75.0,
    persistence_minutes: 5,
    cooldown_minutes: 30
  },
  {
    id: 'set_04',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_04',
    temperature_warning: 37.0,
    temperature_critical: 38.5,
    temperature_min: 32.0,
    humidity_min: 45.0,
    humidity_max: 75.0,
    persistence_minutes: 5,
    cooldown_minutes: 30
  }
];

// Generate Realistic Diurnal Time-Series Sensor Readings for the past 24 hours
export function generate24hReadings(hiveId: string, baseTemp = 35.0, baseHum = 62.0, baseWeight = 26.5): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const intervals = 48; // every 30 mins for 24h
  const stepMs = 30 * 60 * 1000;

  for (let i = intervals; i >= 0; i--) {
    const timestamp = new Date(now - i * stepMs);
    const hour = timestamp.getHours() + timestamp.getMinutes() / 60;
    
    // Solar diurnal cycle: warmest around 14:00 (2 PM), coolest around 05:00 (5 AM)
    const diurnalFactor = Math.sin(((hour - 8) / 24) * 2 * Math.PI);
    
    // Normal healthy brood microclimate regulation:
    // Honeybees actively thermoregulate the central brood comb between 34.5°C and 35.5°C
    const tempNoise = (Math.sin(i * 0.7) * 0.3) + (diurnalFactor * 0.9);
    const temp = Number((baseTemp + tempNoise).toFixed(1));

    // Humidity inverse to temperature
    const humNoise = -(diurnalFactor * 6.0) + (Math.cos(i * 0.5) * 1.5);
    const hum = Number((baseHum + humNoise).toFixed(1));

    // Weight slight daily fluctuation: morning forage loss -> afternoon nectar gain
    const weightGain = diurnalFactor > 0 ? (diurnalFactor * 0.45) : 0;
    const weight = Number((baseWeight + weightGain + (Math.sin(i * 0.2) * 0.05)).toFixed(2));

    // Flight activity peak between 10:00 and 16:00
    let activity = 0;
    if (hour >= 7 && hour <= 18) {
      activity = Math.max(0, Math.round(Math.sin(((hour - 7) / 11) * Math.PI) * 180 + (Math.random() * 25)));
    } else {
      activity = Math.round(Math.random() * 4); // nocturnal guard activity at entrance
    }

    readings.push({
      id: `reading_${hiveId}_${i}`,
      hive_id: hiveId,
      device_id: hiveId === 'hive_01' ? 'dev_01' : hiveId === 'hive_02' ? 'dev_02' : hiveId === 'hive_03' ? 'dev_03' : 'dev_04',
      temperature_c: temp,
      humidity_percent: hum,
      weight_kg: weight,
      activity_count: activity,
      battery_percent: Math.max(70, Math.min(100, Math.round(95 - (i * 0.05)))),
      is_simulated: hiveId !== 'hive_01',
      recorded_at: timestamp.toISOString()
    });
  }

  return readings;
}

export const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: 'alt_01',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_03',
    hive_code: 'HG-003',
    alert_type: 'temperature_warning',
    severity: 'warning',
    message: 'WARNING: Hive HG-003 temperature exceeded configured limit at 37.4°C. Check top ventilation.',
    measured_value: 37.4,
    threshold_value: 37.0,
    status: 'active',
    created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString()
  },
  {
    id: 'alt_02',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_02',
    hive_code: 'HG-002',
    alert_type: 'parasite_concern',
    severity: 'warning',
    message: 'PARASITE SURVEILLANCE: Mite count reached 9 per 300 bees (3.0% threshold). Inspection recommended.',
    measured_value: 3.0,
    threshold_value: 2.5,
    status: 'acknowledged',
    acknowledged_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  },
  {
    id: 'alt_03',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_01',
    hive_code: 'HG-001',
    alert_type: 'critical_temperature',
    severity: 'critical',
    message: 'RESOLVED: Hive HG-001 temperature stabilized to 35.1°C after beekeeper shade board adjustment.',
    measured_value: 38.6,
    threshold_value: 38.5,
    status: 'resolved',
    acknowledged_at: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
    resolved_at: new Date(Date.now() - 1380 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1500 * 60 * 1000).toISOString()
  }
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  id: 'pref_01',
  owner_id: DEFAULT_USER.id,
  sms_enabled: true,
  in_app_enabled: true,
  authorized_phone_numbers: ['+919876543210', '+919845012345'],
  alert_preferences: {
    temperature: true,
    humidity: true,
    parasites: true,
    device: true,
    billing: true
  },
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '06:00',
  sms_consent_given: true,
  consent_updated_at: '2026-09-01T08:15:00Z'
};

export const DEFAULT_NOTIFICATION_LOGS: NotificationLog[] = [
  {
    id: 'log_01',
    owner_id: DEFAULT_USER.id,
    alert_id: 'alt_01',
    channel: 'sms',
    recipient: '+919876543210',
    message_content: 'HIVEGUARD AI ALERT: Hive HG-003 exceeded temperature warning threshold (37.4°C). Please inspect hive ventilation.',
    provider: 'MSG91',
    provider_message_id: 'MSG91_REQ_8819203',
    delivery_status: 'delivered',
    created_at: new Date(Date.now() - 41 * 60 * 1000).toISOString()
  },
  {
    id: 'log_02',
    owner_id: DEFAULT_USER.id,
    alert_id: 'alt_02',
    channel: 'sms',
    recipient: '+919876543210',
    message_content: 'HIVEGUARD AI ALERT: Hive HG-002 mite observation logged at 3.0% threshold. Verify follow-up treatment plan.',
    provider: 'MSG91',
    provider_message_id: 'MSG91_REQ_8818501',
    delivery_status: 'delivered',
    created_at: new Date(Date.now() - 179 * 60 * 1000).toISOString()
  }
];

export const DEFAULT_INSPECTIONS: Inspection[] = [
  {
    id: 'insp_01',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_01',
    hive_code: 'HG-001',
    inspection_date: '2026-10-08',
    inspector_name: 'Ramesh Patil',
    queen_spotted: true,
    brood_pattern: 'solid',
    food_stores: 'adequate',
    temperament: 'calm',
    notes: 'Good brood laying on 6 frames. Nectar incoming steadily from wild bramble.',
    follow_up_date: '2026-10-22',
    created_at: '2026-10-08T11:00:00Z'
  },
  {
    id: 'insp_02',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_02',
    hive_code: 'HG-002',
    inspection_date: '2026-10-10',
    inspector_name: 'Priya Sharma (Field Assistant)',
    queen_spotted: true,
    brood_pattern: 'spotty',
    food_stores: 'heavy',
    temperament: 'nervous',
    notes: 'Slight spotty pattern observed in lower brood chamber. Sugar shake test conducted.',
    follow_up_date: '2026-10-18',
    created_at: '2026-10-10T14:30:00Z'
  }
];

export const DEFAULT_PARASITES: ParasiteObservation[] = [
  {
    id: 'para_01',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_02',
    hive_code: 'HG-002',
    parasite_type: 'Varroa destructor',
    observation_method: 'sugar_shake',
    mite_count: 9,
    sample_size: 300,
    infestation_rate_pct: 3.0,
    model_result: {
      detected_mites_count: 9,
      confidence: 0.88,
      candidate_boxes: [
        { x: 120, y: 84, width: 24, height: 26, score: 0.92 },
        { x: 215, y: 160, width: 22, height: 24, score: 0.89 },
        { x: 310, y: 195, width: 25, height: 25, score: 0.85 }
      ]
    },
    beekeeper_confirmed: true,
    treatment_applied: 'Formic acid vaporization pad installed on top frames',
    observed_at: '2026-10-10T14:45:00Z',
    created_at: '2026-10-10T14:45:00Z'
  },
  {
    id: 'para_02',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_01',
    hive_code: 'HG-001',
    parasite_type: 'Varroa destructor',
    observation_method: 'alcohol_wash',
    mite_count: 2,
    sample_size: 300,
    infestation_rate_pct: 0.67,
    beekeeper_confirmed: true,
    treatment_applied: 'None required. Infestation within low baseline threshold (<1%).',
    observed_at: '2026-10-08T11:20:00Z',
    created_at: '2026-10-08T11:20:00Z'
  }
];

export const DEFAULT_RISK_ASSESSMENTS: RiskAssessment[] = [
  {
    id: 'risk_01',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_01',
    hive_code: 'HG-001',
    risk_level: 'normal',
    assessment_method: 'hybrid',
    confidence_score: 0.94,
    summary: 'Colony microclimate exhibits optimal thermal stability (34.9°C ± 0.4°C). Foraging activity healthy.',
    contributing_factors: [
      'Core brood nest temperature stays within biological comfort zone (34.5°C - 35.5°C)',
      'Diurnal humidity variation is steady with good comb ventilation',
      'Flight activity follows natural daylight curve with over 1,200 entrance counts/hour',
      'Recent alcohol wash confirmed Varroa infestation below 1%'
    ],
    recommended_actions: [
      'Maintain standard bi-weekly inspection schedule',
      'Monitor honey super weight increase over coming flowering flush'
    ],
    assessed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'risk_02',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_02',
    hive_code: 'HG-002',
    risk_level: 'warning',
    assessment_method: 'hybrid',
    confidence_score: 0.89,
    summary: 'Warning: Moderate Varroa mite infestation (3.0%) correlated with slightly reduced morning entrance activity.',
    contributing_factors: [
      'Mite count of 9 / 300 bees exceeds the 2% economic treatment threshold',
      'Morning entrance flight counts dropped by 22% compared with 7-day baseline',
      'Internal brood thermoregulation remains intact at 35.2°C'
    ],
    recommended_actions: [
      'Check Formic acid vaporization treatment pads after 7 days',
      'Re-assess mite count via sticky board wash before removing pads',
      'Inspect brood frame for signs of deformed wing virus (DWV)'
    ],
    assessed_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'risk_03',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_03',
    hive_code: 'HG-003',
    risk_level: 'warning',
    assessment_method: 'rule_based',
    confidence_score: 0.82,
    summary: 'Rule-based assessment: Afternoon temperature excursions above 37°C indicate inadequate hive shading or restricted ventilation.',
    contributing_factors: [
      'Temperature exceeded warning threshold (37.0°C) twice in the last 24 hours',
      'Humidity peaked at 76.5% during night hours, increasing chalkbrood risk'
    ],
    recommended_actions: [
      'Inspect upper hive entrance mesh for propolis blockage',
      'Add reflective shade board or reposition hive under canopy shade',
      'Verify bottom board ventilation slider'
    ],
    assessed_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'risk_04',
    owner_id: DEFAULT_USER.id,
    hive_id: 'hive_04',
    hive_code: 'HG-004',
    risk_level: 'normal',
    assessment_method: 'rule_based',
    confidence_score: 0.91,
    summary: 'Rule-based assessment: Normal conditions. Microclimate stable with moderate nectar accumulation.',
    contributing_factors: [
      'Stable temperature 35.1°C',
      'Weight trend showing positive daily delta of +0.35kg'
    ],
    recommended_actions: [
      'Standard weekly check',
      'Check solar battery charge status'
    ],
    assessed_at: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  }
];

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  id: 'sub_active_01',
  owner_id: DEFAULT_USER.id,
  plan_id: 'plan_yearly',
  plan: DEFAULT_PLANS[1],
  provider_subscription_id: 'sub_rzp_hiveguard_yearly_999',
  status: 'active',
  start_date: '2026-09-01T08:00:00Z',
  renewal_date: '2027-09-01T08:00:00Z',
  created_at: '2026-09-01T08:00:00Z'
};

export const DEFAULT_PAYMENTS: PaymentItem[] = [
  {
    id: 'pay_01',
    owner_id: DEFAULT_USER.id,
    subscription_id: 'sub_active_01',
    provider_payment_id: 'pay_rzp_9182371923',
    amount_inr: 999.00,
    currency: 'INR',
    status: 'success',
    invoice_number: 'INV-HG-2026-0081',
    paid_at: '2026-09-01T08:05:00Z'
  }
];

// In-Memory & LocalStorage Database Store Wrapper
export class HiveGuardDB {
  private static instance: HiveGuardDB;
  private readingsCache: Record<string, SensorReading[]> = {};

  private constructor() {
    this.init();
  }

  public static getInstance(): HiveGuardDB {
    if (!HiveGuardDB.instance) {
      HiveGuardDB.instance = new HiveGuardDB();
    }
    return HiveGuardDB.instance;
  }

  private init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default database state
      this.saveState({
        user: DEFAULT_USER,
        apiaries: DEFAULT_APIARIES,
        hives: DEFAULT_HIVES,
        devices: DEFAULT_DEVICES,
        alertSettings: DEFAULT_ALERT_SETTINGS,
        alerts: DEFAULT_ALERTS,
        notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
        notificationLogs: DEFAULT_NOTIFICATION_LOGS,
        inspections: DEFAULT_INSPECTIONS,
        parasites: DEFAULT_PARASITES,
        riskAssessments: DEFAULT_RISK_ASSESSMENTS,
        subscription: DEFAULT_SUBSCRIPTION,
        payments: DEFAULT_PAYMENTS
      });
    }

    // Pre-populate time series
    DEFAULT_HIVES.forEach((hive) => {
      if (!this.readingsCache[hive.id]) {
        const baseTemp = hive.id === 'hive_03' ? 36.2 : 35.0;
        this.readingsCache[hive.id] = generate24hReadings(hive.id, baseTemp);
      }
    });
  }

  private getState(): any {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveState(state: any) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save HIVEGUARD AI state to localStorage:', e);
    }
  }

  // --- User Profile ---
  public getUser(): UserProfile {
    return this.getState().user || DEFAULT_USER;
  }

  public updateUser(user: Partial<UserProfile>): UserProfile {
    const state = this.getState();
    state.user = { ...state.user, ...user };
    this.saveState(state);
    return state.user;
  }

  // --- Apiaries ---
  public getApiaries(): Apiary[] {
    const state = this.getState();
    const hives = this.getHives();
    return (state.apiaries || []).map((a: Apiary) => ({
      ...a,
      hive_count: hives.filter((h) => h.apiary_id === a.id).length
    }));
  }

  public createApiary(data: Omit<Apiary, 'id' | 'created_at' | 'owner_id'>): Apiary {
    const state = this.getState();
    const user = this.getUser();
    const newApiary: Apiary = {
      ...data,
      id: `apiary_${Date.now()}`,
      owner_id: user.id,
      created_at: new Date().toISOString()
    };
    state.apiaries = [...(state.apiaries || []), newApiary];
    this.saveState(state);
    return newApiary;
  }

  public updateApiary(id: string, data: Partial<Apiary>): Apiary {
    const state = this.getState();
    state.apiaries = (state.apiaries || []).map((a: Apiary) =>
      a.id === id ? { ...a, ...data } : a
    );
    this.saveState(state);
    return state.apiaries.find((a: Apiary) => a.id === id)!;
  }

  // --- Hives ---
  public getHives(): Hive[] {
    const state = this.getState();
    const apiaries = state.apiaries || [];
    const devices = state.devices || [];
    const alerts = state.alerts || [];

    return (state.hives || []).map((h: Hive) => {
      const apiary = apiaries.find((a: Apiary) => a.id === h.apiary_id);
      const dev = devices.find((d: IoTDevice) => d.hive_id === h.id);
      const latestReading = this.getLatestReading(h.id);
      const activeAlerts = alerts.filter((alt: AlertItem) => alt.hive_id === h.id && alt.status === 'active');
      const risk = (state.riskAssessments || []).find((r: RiskAssessment) => r.hive_id === h.id);

      return {
        ...h,
        apiary_name: apiary ? apiary.name : 'Unassigned',
        device: dev,
        current_reading: latestReading,
        active_alerts_count: activeAlerts.length,
        risk_level: risk ? risk.risk_level : 'normal'
      };
    });
  }

  public getHiveById(id: string): Hive | undefined {
    return this.getHives().find((h) => h.id === id);
  }

  public createHive(data: { name: string; hive_code: string; apiary_id: string; bee_species?: string; notes?: string; device_code?: string }): Hive {
    const state = this.getState();
    const user = this.getUser();
    const hiveId = `hive_${Date.now()}`;

    const newHive: Hive = {
      id: hiveId,
      apiary_id: data.apiary_id,
      owner_id: user.id,
      hive_code: data.hive_code.toUpperCase(),
      name: data.name,
      bee_species: data.bee_species || 'Apis cerana indica',
      installation_date: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };

    state.hives = [...(state.hives || []), newHive];

    // Create device if specified
    const devCode = data.device_code ? data.device_code.toUpperCase() : `ESP32-${newHive.hive_code}`;
    const newDevice: IoTDevice = {
      id: `dev_${Date.now()}`,
      hive_id: hiveId,
      owner_id: user.id,
      device_code: devCode,
      firmware_version: 'v1.2.0',
      battery_level: 100,
      signal_strength: -64,
      last_seen_at: new Date().toISOString(),
      connection_status: 'online',
      is_simulated: true,
      created_at: new Date().toISOString()
    };
    state.devices = [...(state.devices || []), newDevice];

    // Default alert settings
    const newSettings: AlertSettings = {
      id: `set_${Date.now()}`,
      owner_id: user.id,
      hive_id: hiveId,
      temperature_warning: 37.0,
      temperature_critical: 38.5,
      temperature_min: 32.0,
      humidity_min: 45.0,
      humidity_max: 75.0,
      persistence_minutes: 5,
      cooldown_minutes: 30
    };
    state.alertSettings = [...(state.alertSettings || []), newSettings];

    this.saveState(state);

    // Seed readings for new hive
    this.readingsCache[hiveId] = generate24hReadings(hiveId, 34.8);

    return this.getHiveById(hiveId)!;
  }

  public updateHive(id: string, data: Partial<Hive>): Hive {
    const state = this.getState();
    state.hives = (state.hives || []).map((h: Hive) =>
      h.id === id ? { ...h, ...data } : h
    );
    this.saveState(state);
    return this.getHiveById(id)!;
  }

  // --- Sensor Readings & Time Series ---
  public getReadings(hiveId: string, limit = 48): SensorReading[] {
    if (!this.readingsCache[hiveId]) {
      this.readingsCache[hiveId] = generate24hReadings(hiveId);
    }
    const list = this.readingsCache[hiveId] || [];
    return list.slice(-limit);
  }

  public getLatestReading(hiveId: string): SensorReading | undefined {
    const readings = this.getReadings(hiveId);
    return readings.length > 0 ? readings[readings.length - 1] : undefined;
  }

  public appendReading(reading: Omit<SensorReading, 'id'>): SensorReading {
    const newReading: SensorReading = {
      ...reading,
      id: `reading_${Date.now()}`
    };

    if (!this.readingsCache[reading.hive_id]) {
      this.readingsCache[reading.hive_id] = [];
    }
    this.readingsCache[reading.hive_id].push(newReading);

    // Keep cache bounded to 100 entries per hive
    if (this.readingsCache[reading.hive_id].length > 100) {
      this.readingsCache[reading.hive_id].shift();
    }

    return newReading;
  }

  // --- Alert Settings ---
  public getAlertSettings(hiveId: string): AlertSettings {
    const state = this.getState();
    const found = (state.alertSettings || []).find((s: AlertSettings) => s.hive_id === hiveId);
    if (found) return found;

    return {
      id: `set_${hiveId}`,
      owner_id: this.getUser().id,
      hive_id: hiveId,
      temperature_warning: 37.0,
      temperature_critical: 38.5,
      temperature_min: 32.0,
      humidity_min: 45.0,
      humidity_max: 75.0,
      persistence_minutes: 5,
      cooldown_minutes: 30
    };
  }

  public saveAlertSettings(settings: AlertSettings): AlertSettings {
    const state = this.getState();
    const existingIdx = (state.alertSettings || []).findIndex((s: AlertSettings) => s.hive_id === settings.hive_id);
    if (existingIdx >= 0) {
      state.alertSettings[existingIdx] = settings;
    } else {
      state.alertSettings = [...(state.alertSettings || []), settings];
    }
    this.saveState(state);
    return settings;
  }

  // --- Alerts ---
  public getAlerts(): AlertItem[] {
    const state = this.getState();
    return state.alerts || [];
  }

  public createAlert(alert: Omit<AlertItem, 'id' | 'created_at'>): AlertItem {
    const state = this.getState();
    const newAlert: AlertItem = {
      ...alert,
      id: `alt_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    state.alerts = [newAlert, ...(state.alerts || [])];
    this.saveState(state);
    return newAlert;
  }

  public updateAlertStatus(id: string, status: 'acknowledged' | 'resolved'): AlertItem {
    const state = this.getState();
    state.alerts = (state.alerts || []).map((a: AlertItem) => {
      if (a.id === id) {
        return {
          ...a,
          status,
          acknowledged_at: status === 'acknowledged' ? new Date().toISOString() : a.acknowledged_at,
          resolved_at: status === 'resolved' ? new Date().toISOString() : a.resolved_at
        };
      }
      return a;
    });
    this.saveState(state);
    return state.alerts.find((a: AlertItem) => a.id === id)!;
  }

  // --- Notification Preferences & Consent ---
  public getNotificationPreferences(): NotificationPreferences {
    const state = this.getState();
    return state.notificationPreferences || DEFAULT_NOTIFICATION_PREFERENCES;
  }

  public saveNotificationPreferences(prefs: Partial<NotificationPreferences>): NotificationPreferences {
    const state = this.getState();
    state.notificationPreferences = {
      ...(state.notificationPreferences || DEFAULT_NOTIFICATION_PREFERENCES),
      ...prefs,
      consent_updated_at: new Date().toISOString()
    };
    this.saveState(state);
    return state.notificationPreferences;
  }

  // --- Notification Logs ---
  public getNotificationLogs(): NotificationLog[] {
    const state = this.getState();
    return state.notificationLogs || [];
  }

  public addNotificationLog(log: Omit<NotificationLog, 'id' | 'created_at'>): NotificationLog {
    const state = this.getState();
    const newLog: NotificationLog = {
      ...log,
      id: `log_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    state.notificationLogs = [newLog, ...(state.notificationLogs || [])];
    this.saveState(state);
    return newLog;
  }

  // --- Inspections ---
  public getInspections(hiveId?: string): Inspection[] {
    const state = this.getState();
    const list: Inspection[] = state.inspections || [];
    return hiveId ? list.filter((i) => i.hive_id === hiveId) : list;
  }

  public createInspection(insp: Omit<Inspection, 'id' | 'created_at' | 'owner_id'>): Inspection {
    const state = this.getState();
    const newInsp: Inspection = {
      ...insp,
      id: `insp_${Date.now()}`,
      owner_id: this.getUser().id,
      created_at: new Date().toISOString()
    };
    state.inspections = [newInsp, ...(state.inspections || [])];
    this.saveState(state);
    return newInsp;
  }

  // --- Parasite Observations ---
  public getParasites(hiveId?: string): ParasiteObservation[] {
    const state = this.getState();
    const list: ParasiteObservation[] = state.parasites || [];
    return hiveId ? list.filter((p) => p.hive_id === hiveId) : list;
  }

  public createParasiteObservation(obs: Omit<ParasiteObservation, 'id' | 'created_at' | 'owner_id'>): ParasiteObservation {
    const state = this.getState();
    const newObs: ParasiteObservation = {
      ...obs,
      id: `para_${Date.now()}`,
      owner_id: this.getUser().id,
      created_at: new Date().toISOString()
    };
    state.parasites = [newObs, ...(state.parasites || [])];
    this.saveState(state);
    return newObs;
  }

  // --- Risk Assessments ---
  public getRiskAssessments(): RiskAssessment[] {
    const state = this.getState();
    return state.riskAssessments || [];
  }

  public saveRiskAssessment(risk: RiskAssessment): RiskAssessment {
    const state = this.getState();
    const list = state.riskAssessments || [];
    const idx = list.findIndex((r: RiskAssessment) => r.hive_id === risk.hive_id);
    if (idx >= 0) {
      list[idx] = risk;
    } else {
      list.push(risk);
    }
    state.riskAssessments = list;
    this.saveState(state);
    return risk;
  }

  // --- Subscriptions & Payments ---
  public getSubscription(): UserSubscription {
    const state = this.getState();
    return state.subscription || DEFAULT_SUBSCRIPTION;
  }

  public setSubscription(sub: UserSubscription): UserSubscription {
    const state = this.getState();
    state.subscription = sub;
    this.saveState(state);
    return sub;
  }

  public getPayments(): PaymentItem[] {
    const state = this.getState();
    return state.payments || [];
  }

  public addPayment(payment: Omit<PaymentItem, 'id'>): PaymentItem {
    const state = this.getState();
    const newPay: PaymentItem = {
      ...payment,
      id: `pay_${Date.now()}`
    };
    state.payments = [newPay, ...(state.payments || [])];
    this.saveState(state);
    return newPay;
  }

  // --- IoT Devices ---
  public getDevices(): IoTDevice[] {
    const state = this.getState();
    return state.devices || [];
  }

  public updateDevice(deviceId: string, data: Partial<IoTDevice>): void {
    const state = this.getState();
    const devices = (state.devices || []).map((d: IoTDevice) =>
      d.id === deviceId ? { ...d, ...data } : d
    );
    state.devices = devices;
    this.saveState(state);
  }

  // Reset database to initial state
  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.init();
  }
}

export const db = HiveGuardDB.getInstance();
