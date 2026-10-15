import React from 'react';
import {
  ShieldCheck,
  Activity,
  Bell,
  BrainCircuit,
  Bug,
  ThermometerSun,
  Droplets,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/layout/Footer';

interface LandingPageProps {
  onNavigate: (route: string) => void;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSimulator }) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E3D9] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo size="md" showTagline />
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <a href="#problem" className="hover:text-emerald-800 transition-colors">The Problem</a>
          <a href="#solution" className="hover:text-emerald-800 transition-colors">Solution</a>
          <a href="#how-it-works" className="hover:text-emerald-800 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-emerald-800 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-emerald-800 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-8 bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#143D2B] text-white">
        {/* Subtle geometric honeycomb backdrop */}
        <div className="absolute inset-0 bg-honeycomb-dark opacity-40 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Smart Beehive Monitoring & Early Warning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Beehives Deserve <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-200">
              Early Protection.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            HIVEGUARD AI combines IoT sensors and intelligent risk analysis to help beekeepers monitor hive conditions, receive timely alerts, and make better-informed colony management decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('onboarding')}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Start Monitoring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSimulator}
              className="px-6 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600/50 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Test Hardware Simulator</span>
            </button>
          </div>

          {/* Quick telemetry preview pill */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-around text-xs">
              <div className="flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-amber-400" />
                <span>Optimal Brood Temp: <strong>34.5°C - 35.5°C</strong></span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>Comfort Humidity: <strong>50% - 75%</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">The Challenge</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Traditional Beekeeping Suffers Silent Colony Loss
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Smallholder beekeepers and commercial apiaries often discover deadly temperature spikes, chalkbrood dampness, and Varroa destructor mite infestations only after colonies have already weakened or absconded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 w-fit">
              <ThermometerSun className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Delayed Heat & Chilling Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When hive temperatures exceed 38.5°C or drop below 32°C during cold nights, pupae die and brood comb structure collapses before physical inspections occur.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 w-fit">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Undetected Parasite Infestation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Varroa mites multiply exponentially within capped brood cells. Without systematic observation and treatment tracking, mite loads surpass 3% and spread Deformed Wing Virus (DWV).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E3D9] shadow-xs space-y-3">
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-700 w-fit">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Remote Apiary Inaccessibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Out-apiaries in orchards and forest valleys cannot be inspected every single day. Beekeepers need autonomous, solar/battery-powered sensor sentinels that alert them over SMS.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="solution" className="py-16 px-4 sm:px-8 bg-[#FAF6EE] border-y border-[#E8E3D9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Our Integrated Solution</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Continuous Intelligence from Sensor to Beekeeper
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              HIVEGUARD AI combines rugged ESP32 hardware nodes with a centralized cloud dashboard, AI risk scoring, and automated SMS alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 w-fit">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Continuous IoT Telemetry</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                DHT22 microclimate sensors, HX711 hive scales, and IR entrance counters stream data directly to Supabase.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 w-fit">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Explainable AI Risk Scoring</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diurnal variance analysis highlights failing thermoregulation, brood dampness, and swarming loss without opaque black-box claims.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-2">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 w-fit">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Early SMS Alerts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct SMS messages dispatched via MSG91/Twilio to your phone with cooldown protection and hysteresis to prevent repeated spam.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E3D9] shadow-xs space-y-2">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 w-fit">
                <Bug className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Parasite Surveillance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record mite counts from sugar shake or alcohol washes, with optional computer-vision candidate frame analysis and treatment logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Simple 4-Step Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How HIVEGUARD AI Protects Your Colonies
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Connect Sensors',
              desc: 'Mount the calibrated ESP32 sensor module above the brood frames and power via USB or solar battery.',
            },
            {
              step: '02',
              title: 'Monitor Conditions',
              desc: 'Track core temperature, humidity curves, flight activity, and scale weight in real time on the dashboard.',
            },
            {
              step: '03',
              title: 'Receive Alerts',
              desc: 'When temperature breaches your configured threshold, an urgent SMS and in-app alert is generated immediately.',
            },
            {
              step: '04',
              title: 'Inspect & Record',
              desc: 'Inspect the hive, record Varroa observations, apply treatments, and track colony recovery over time.',
            },
          ].map((item, idx) => (
            <div key={idx} className="relative p-6 rounded-3xl bg-white border border-[#E8E3D9] shadow-xs">
              <span className="text-3xl font-black text-amber-500/20 absolute top-4 right-5">{item.step}</span>
              <h4 className="font-bold text-base text-slate-900 mb-2">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-16 px-4 sm:px-8 bg-[#FAF6EE] border-t border-[#E8E3D9]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Simple, Affordable Plans for Healthier Hives
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Start monitoring your colonies and choose a plan that fits your apiary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Monthly Plan */}
            <div className="p-7 rounded-3xl bg-white border border-[#E8E3D9] shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Flexible Monthly Plan</p>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-4xl font-extrabold text-slate-900">₹99</span>
                  <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-600 mb-6">Billed every month. Cancel anytime.</p>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 10 registered hives</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>50 automated SMS alerts / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Continuous environmental telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI-assisted risk analysis</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('subscription')}
                className="mt-8 w-full py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Choose Monthly Plan
              </button>
            </div>

            {/* Yearly Plan - Best Value */}
            <div className="relative p-7 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white border-2 border-amber-500 shadow-md flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                BEST VALUE — SAVE ₹189
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Annual Colony Protector</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-xs font-semibold text-slate-500">/ year</span>
                </div>
                <p className="text-xs text-slate-400 line-through mt-0.5">Regular price: ₹1,188 / year</p>

                <div className="my-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium space-y-1">
                  <p className="font-bold">You save ₹189 per year</p>
                  <p className="text-[11px] text-amber-800">
                    Equivalent to <strong>₹83.25/month</strong> (Save approx. 15.9% compared with monthly billing).
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Up to 25 registered hives</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>200 automated SMS alerts / month</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full historical telemetry & CSV export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Priority technical support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('subscription')}
                className="mt-8 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 transition-colors shadow-sm"
              >
                Choose Yearly Plan (Best Value)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4 sm:px-8 bg-emerald-950 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Give Every Colony a Better Chance.
          </h2>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Join beekeepers using real-time IoT microclimate telemetry to detect problems before colonies weaken or abscond.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore Live Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
