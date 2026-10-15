-- ====================================================================
-- HIVEGUARD AI: Complete PostgreSQL Database Schema & RLS Policies
-- AI-Powered Smart Beehive Monitoring & Early Warning System
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    organization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Apiaries Table
CREATE TABLE IF NOT EXISTS public.apiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Hives Table
CREATE TABLE IF NOT EXISTS public.hives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apiary_id UUID NOT NULL REFERENCES public.apiaries(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hive_code TEXT NOT NULL,
    name TEXT NOT NULL,
    bee_species TEXT DEFAULT 'Apis mellifera',
    installation_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'quarantined', 'archived', 'inactive')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(owner_id, hive_code)
);

-- 5. IoT Devices Table
CREATE TABLE IF NOT EXISTS public.iot_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hive_id UUID REFERENCES public.hives(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_code TEXT NOT NULL UNIQUE,
    firmware_version TEXT DEFAULT 'v1.2.0',
    battery_level INTEGER DEFAULT 100,
    signal_strength INTEGER DEFAULT -65,
    last_seen_at TIMESTAMPTZ,
    connection_status TEXT NOT NULL DEFAULT 'offline' CHECK (connection_status IN ('online', 'offline', 'warning')),
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Device Credentials Table (Kept secret, never readable by public or client roles)
CREATE TABLE IF NOT EXISTS public.device_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES public.iot_devices(id) ON DELETE CASCADE,
    credential_hash TEXT NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Alert Settings Table (Per-hive customizable thresholds)
CREATE TABLE IF NOT EXISTS public.alert_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE UNIQUE,
    temperature_warning NUMERIC(4, 1) DEFAULT 37.0,
    temperature_critical NUMERIC(4, 1) DEFAULT 38.5,
    temperature_min NUMERIC(4, 1) DEFAULT 32.0,
    humidity_min NUMERIC(4, 1) DEFAULT 45.0,
    humidity_max NUMERIC(4, 1) DEFAULT 75.0,
    humidity_critical_min NUMERIC(4, 1) DEFAULT 35.0,
    humidity_critical_max NUMERIC(4, 1) DEFAULT 85.0,
    weight_drop_threshold_kg NUMERIC(4, 2) DEFAULT 1.5,
    persistence_minutes INTEGER DEFAULT 5,
    cooldown_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Sensor Readings Table (Time-Series)
CREATE TABLE IF NOT EXISTS public.sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.iot_devices(id) ON DELETE SET NULL,
    temperature_c NUMERIC(5, 2) NOT NULL,
    humidity_percent NUMERIC(5, 2) NOT NULL,
    weight_kg NUMERIC(6, 2),
    activity_count INTEGER,
    battery_percent INTEGER,
    is_simulated BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_hive_time ON public.sensor_readings (hive_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device ON public.sensor_readings (device_id);

-- 9. Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'temperature_warning', 'critical_temperature', 'humidity_anomaly',
        'unusual_bee_activity', 'weight_loss_swarm', 'parasite_concern',
        'device_offline', 'sensor_malfunction', 'low_battery', 'subscription_alert'
    )),
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    message TEXT NOT NULL,
    measured_value NUMERIC(6, 2),
    threshold_value NUMERIC(6, 2),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_owner_status ON public.alerts (owner_id, status);
CREATE INDEX IF NOT EXISTS idx_alerts_hive ON public.alerts (hive_id);

-- 10. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    authorized_phone_numbers TEXT[] DEFAULT ARRAY[]::TEXT[],
    alert_preferences JSONB DEFAULT '{"temperature": true, "humidity": true, "parasites": true, "device": true, "billing": true}'::JSONB,
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TEXT DEFAULT '22:00',
    quiet_hours_end TEXT DEFAULT '06:00',
    sms_consent_given BOOLEAN DEFAULT FALSE,
    consent_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notification Logs Table (SMS & In-App dispatch audit log)
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE SET NULL,
    channel TEXT NOT NULL CHECK (channel IN ('sms', 'in_app', 'email')),
    recipient TEXT NOT NULL,
    message_content TEXT NOT NULL,
    provider TEXT DEFAULT 'MSG91',
    provider_message_id TEXT,
    delivery_status TEXT NOT NULL CHECK (delivery_status IN ('pending', 'delivered', 'failed', 'suppressed', 'provider_not_configured')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Inspections Table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE,
    inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    inspector_name TEXT NOT NULL,
    queen_spotted BOOLEAN DEFAULT TRUE,
    brood_pattern TEXT CHECK (brood_pattern IN ('excellent', 'solid', 'spotty', 'no_brood')),
    food_stores TEXT CHECK (food_stores IN ('heavy', 'adequate', 'light', 'starving')),
    temperament TEXT CHECK (temperament IN ('calm', 'nervous', 'aggressive')),
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Parasite Observations Table
CREATE TABLE IF NOT EXISTS public.parasite_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE,
    parasite_type TEXT NOT NULL DEFAULT 'Varroa destructor',
    observation_method TEXT NOT NULL CHECK (observation_method IN ('alcohol_wash', 'sugar_shake', 'sticky_board', 'visual_inspection', 'ai_vision')),
    mite_count INTEGER NOT NULL DEFAULT 0,
    sample_size INTEGER DEFAULT 300,
    infestation_rate_pct NUMERIC(5, 2),
    image_path TEXT,
    model_result JSONB,
    beekeeper_confirmed BOOLEAN DEFAULT TRUE,
    treatment_applied TEXT,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AI Risk Assessments Table
CREATE TABLE IF NOT EXISTS public.risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hive_id UUID NOT NULL REFERENCES public.hives(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('normal', 'warning', 'high_risk', 'insufficient_data')),
    assessment_method TEXT NOT NULL DEFAULT 'rule_based' CHECK (assessment_method IN ('rule_based', 'ai_ml_model', 'hybrid')),
    confidence_score NUMERIC(4, 2),
    summary TEXT NOT NULL,
    contributing_factors JSONB NOT NULL DEFAULT '[]'::JSONB,
    recommended_actions JSONB NOT NULL DEFAULT '[]'::JSONB,
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_code TEXT NOT NULL UNIQUE,
    plan_name TEXT NOT NULL,
    price_inr NUMERIC(8, 2) NOT NULL,
    billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly', 'yearly')),
    monthly_equivalent_inr NUMERIC(8, 2) NOT NULL,
    annual_savings_inr NUMERIC(8, 2) DEFAULT 0,
    savings_percentage NUMERIC(5, 2) DEFAULT 0,
    entitlements JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- Seed Default Subscription Plans
INSERT INTO public.subscription_plans (
    plan_code, plan_name, price_inr, billing_interval, monthly_equivalent_inr, annual_savings_inr, savings_percentage, entitlements, active
) VALUES
(
    'monthly_standard',
    'Flexible Monthly Plan',
    99.00,
    'monthly',
    99.00,
    0.00,
    0.00,
    '{"max_hives": 10, "sms_per_month": 50, "sensor_interval_sec": 60, "ai_risk_analysis": true, "csv_export": true, "data_retention_days": 90}'::JSONB,
    TRUE
),
(
    'yearly_best_value',
    'Annual Colony Protector (Best Value)',
    999.00,
    'yearly',
    83.25,
    189.00,
    15.90,
    '{"max_hives": 25, "sms_per_month": 200, "sensor_interval_sec": 30, "ai_risk_analysis": true, "csv_export": true, "data_retention_days": 365, "priority_support": true}'::JSONB,
    TRUE
)
ON CONFLICT (plan_code) DO NOTHING;

-- 16. User Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    provider_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
    start_date TIMESTAMPTZ DEFAULT NOW(),
    renewal_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    provider_payment_id TEXT NOT NULL,
    amount_inr NUMERIC(8, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending', 'refunded')),
    invoice_number TEXT,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parasite_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Apiaries: Users can manage only their own apiaries
CREATE POLICY "Users manage own apiaries" ON public.apiaries FOR ALL USING (auth.uid() = owner_id);

-- Hives: Users can manage only their own hives
CREATE POLICY "Users manage own hives" ON public.hives FOR ALL USING (auth.uid() = owner_id);

-- Devices: Users can view and manage their own registered devices
CREATE POLICY "Users manage own devices" ON public.iot_devices FOR ALL USING (auth.uid() = owner_id);

-- Device Credentials: NO client access. Only accessible through Service Role / Edge Functions
-- (No client select policy on purpose)

-- Alert Settings: Users manage alert thresholds for their hives
CREATE POLICY "Users manage alert settings" ON public.alert_settings FOR ALL USING (auth.uid() = owner_id);

-- Sensor Readings: Users can view readings for hives they own
CREATE POLICY "Users read own hive sensors" ON public.sensor_readings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hives WHERE public.hives.id = sensor_readings.hive_id AND public.hives.owner_id = auth.uid())
);
CREATE POLICY "Edge function/Users insert sensor readings" ON public.sensor_readings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.hives WHERE public.hives.id = sensor_readings.hive_id AND public.hives.owner_id = auth.uid())
);

-- Alerts: Users can view and update their own alerts
CREATE POLICY "Users view own alerts" ON public.alerts FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users update own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users insert alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Notification Preferences
CREATE POLICY "Users manage notification preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = owner_id);

-- Notification Logs
CREATE POLICY "Users view notification logs" ON public.notification_logs FOR SELECT USING (auth.uid() = owner_id);

-- Inspections
CREATE POLICY "Users manage inspections" ON public.inspections FOR ALL USING (auth.uid() = owner_id);

-- Parasite Observations
CREATE POLICY "Users manage parasite observations" ON public.parasite_observations FOR ALL USING (auth.uid() = owner_id);

-- Risk Assessments
CREATE POLICY "Users view risk assessments" ON public.risk_assessments FOR SELECT USING (auth.uid() = owner_id);

-- Subscription Plans: Publicly readable by all authenticated users
CREATE POLICY "Anyone view active plans" ON public.subscription_plans FOR SELECT TO authenticated USING (active = TRUE);

-- User Subscriptions
CREATE POLICY "Users view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = owner_id);

-- Payments
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = owner_id);

-- Realtime Setup: Enable Realtime for live sensor streams & alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.iot_devices;
