import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Layers,
  BrainCircuit,
  Bug,
  Bell,
  BarChart3,
  CreditCard,
  Receipt,
  Settings,
  HelpCircle,
  ShieldCheck,
  FileText,
  Compass,
  X,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
  unreadAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  isOpen,
  onClose,
  unreadAlertsCount,
}) => {
  const navSections = [
    {
      label: 'Monitoring & IoT',
      items: [
        { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
        { id: 'live-monitoring', label: 'Live IoT Telemetry', icon: Activity, badge: 'Realtime' },
        { id: 'hives', label: 'Apiaries & Hives', icon: Layers },
      ],
    },
    {
      label: 'Intelligence & Health',
      items: [
        { id: 'ai-risk', label: 'AI Risk Analysis', icon: BrainCircuit, badge: 'AI Model' },
        { id: 'parasite-inspection', label: 'Parasite & Inspections', icon: Bug },
        { id: 'notifications', label: 'Alerts & SMS Logs', icon: Bell, count: unreadAlertsCount },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
    {
      label: 'Account & Service',
      items: [
        { id: 'subscription', label: 'Subscription Plans', icon: CreditCard, highlight: true },
        { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
        { id: 'settings', label: 'System Settings', icon: Settings },
        { id: 'onboarding', label: 'Onboarding Wizard', icon: Compass },
      ],
    },
    {
      label: 'Resources & Legal',
      items: [
        { id: 'help-docs', label: 'ESP32 Wiring & Docs', icon: HelpCircle },
        { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
        { id: 'landing', label: 'Public Homepage', icon: ExternalLink },
      ],
    },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#143D2B] text-slate-200 flex flex-col border-r border-[#1B4332] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1E4D38] bg-[#0E2E20]">
          <div className="cursor-pointer" onClick={() => handleNav('dashboard')}>
            <Logo size="md" lightMode />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 mb-1.5">
                {sec.label}
              </p>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : item.highlight
                          ? 'text-amber-300 hover:bg-emerald-900/60 hover:text-amber-200'
                          : 'text-emerald-100/90 hover:bg-emerald-900/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-emerald-300'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            isActive
                              ? 'bg-slate-950 text-amber-400'
                              : 'bg-emerald-800/80 text-emerald-300 border border-emerald-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-600 text-white">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Colony Protection Status */}
        <div className="p-3.5 border-t border-[#1E4D38] bg-[#0E2E20]">
          <div className="p-3 rounded-2xl bg-[#143D2B] border border-emerald-800/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Colony Shield v1.2</p>
              <p className="text-[10px] text-emerald-300/80">Active Early Warning</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
