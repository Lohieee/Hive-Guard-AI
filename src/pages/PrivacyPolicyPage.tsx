import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Database, PhoneCall, Globe } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

interface PrivacyPolicyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 flex-1 space-y-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy & Data Sovereignty</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            HIVEGUARD AI Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 2026 • Effective for all HIVEGUARD AI registered users and IoT sensor nodes.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D9] shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-800" />
              <span>1. Overview & Agricultural Data Protection</span>
            </h2>
            <p>
              HIVEGUARD AI respects the confidentiality and sovereignty of beekeepers' operational data. We recognize that hive locations, honey production metrics, and apiary coordinates are sensitive commercial assets. We do not sell, rent, or publicly disclose individual beekeeper telemetry, geographic coordinates, or inspection logs to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-800" />
              <span>2. Telemetry & Sensor Information Collected</span>
            </h2>
            <p>
              When an ESP32 microcontroller node or mobile device connects to HIVEGUARD AI, we record:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Environmental readings (internal temperature, relative humidity, barometric pressure).</li>
              <li>Load cell scale weight measurements and flight activity counts.</li>
              <li>Device health telemetry (battery voltage, signal strength RSSI, firmware version, and timestamps).</li>
              <li>Physical inspection observations (Varroa mite counts, queen laying patterns, treatment actions).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-800" />
              <span>3. Explicit SMS Notification Consent</span>
            </h2>
            <p>
              We only send SMS alerts to telephone numbers that you explicitly configure in your Notification Settings. Automated early warnings are transmitted strictly for critical thermal events (&gt;38.5°C), severe dampness anomalies, or rapid swarming weight loss. You can revoke SMS consent or update authorized numbers at any time from the Settings page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-800" />
              <span>4. Database Isolation & Row Level Security</span>
            </h2>
            <p>
              All database records in Supabase PostgreSQL are strictly protected by Row Level Security (RLS) policies tied to your cryptographic authentication UID. Device tokens and payment gateway credentials are kept in server-side vaults and never exposed in browser runtime code.
            </p>
          </section>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
