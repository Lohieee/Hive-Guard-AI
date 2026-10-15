import React from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#143D2B] text-slate-300 border-t border-[#1E4D38] pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" lightMode showTagline />
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-md">
              HIVEGUARD AI is an IoT-powered smart beehive monitoring platform that collects sensor data, monitors hive conditions in real time, identifies unusual environmental patterns, and sends early SMS warnings to protect colony health.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Designed for smallholder beekeepers, commercial apiaries, and researchers.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Monitoring Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('live-monitoring')} className="hover:text-white transition-colors">
                  Live IoT Telemetry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-risk')} className="hover:text-white transition-colors">
                  AI Risk Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('parasite-inspection')} className="hover:text-white transition-colors">
                  Varroa Mite Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subscription')} className="hover:text-white transition-colors">
                  Pricing Plans (₹99/mo, ₹999/yr)
                </button>
              </li>
            </ul>
          </div>

          {/* Docs & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Resources & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('help-docs')} className="hover:text-white transition-colors">
                  ESP32 Setup & Wiring
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('onboarding')} className="hover:text-white transition-colors">
                  Onboarding Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-white transition-colors">
                  SMS Preferences & Consent
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1E4D38] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <p>© {new Date().getFullYear()} HIVEGUARD AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Empowering sustainable apiculture with <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> & IoT Technology.
          </p>
        </div>
      </div>
    </footer>
  );
};
