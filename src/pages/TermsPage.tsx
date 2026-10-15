import React from 'react';
import { FileText, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

interface TermsPageProps {
  onNavigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Service Agreement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service & Conditions
          </h1>
          <p className="text-xs text-slate-500">
            Effective Date: October 2026 • Governs use of HIVEGUARD AI Web Application and IoT Node Services.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D9] shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Nature of the Early-Warning Service
            </h2>
            <p>
              HIVEGUARD AI is an agricultural telemetry monitoring tool designed to assist beekeepers in detecting microclimate abnormalities, temperature excursions, and weight fluctuations. The platform provides decision-support information and early warnings, but does not guarantee the prevention of colony swarming, disease outbreaks, queen death, or environmental absconding.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Beekeeper Inspection Responsibility
            </h2>
            <p>
              Sensor readings should supplement, not replace, regular physical apiary inspections. AI risk scores and rule-based assessments are analytical indicators derived from sensor trends and historical observations. Final management decisions regarding miticide applications, supplemental feeding, and hive ventilation remain the sole responsibility of the beekeeper.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Telecommunication & Cellular Limitations
            </h2>
            <p>
              SMS notifications depend on third-party telecommunication providers and cellular tower coverage. While HIVEGUARD AI implements delivery retries, cooldown logic, and audit logging, delivery cannot be guaranteed in remote areas experiencing total signal loss or network carrier downtime.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Subscription & Cancellation Terms
            </h2>
            <p>
              Monthly plans (₹99/mo) and annual plans (₹999/yr) are billed in Indian Rupees. You may cancel recurring renewals at any time from your Billing History dashboard. Paid entitlements remain active through the conclusion of the paid billing period.
            </p>
          </section>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
