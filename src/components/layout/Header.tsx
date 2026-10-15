import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Sparkles,
  Wifi,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  ShieldCheck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { db } from '../../services/mockDb';
import { AlertItem } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  onOpenSimulator: () => void;
  onNavigate: (route: string) => void;
  activeRoute: string;
  selectedApiaryId: string;
  onSelectApiary: (apiaryId: string) => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onOpenSimulator,
  onNavigate,
  selectedApiaryId,
  onSelectApiary,
  unreadAlertsCount,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  const user = db.getUser();
  const apiaries = db.getApiaries();
  const alerts = db.getAlerts().filter((a: AlertItem) => a.status === 'active').slice(0, 5);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E3D9] h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="cursor-pointer lg:hidden" onClick={() => onNavigate('dashboard')}>
          <Logo size="sm" />
        </div>

        {/* Global Apiary Selector */}
        <div className="hidden sm:flex items-center gap-2 pl-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Apiary:</span>
          <select
            value={selectedApiaryId}
            onChange={(e) => onSelectApiary(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
          >
            <option value="all">All Apiaries ({apiaries.length})</option>
            {apiaries.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.hive_count} hives)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Live IoT Status, Simulation Mode, Alerts, User */}
      <div className="flex items-center gap-2.5">
        {/* Hardware Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <Wifi className="w-3.5 h-3.5 text-emerald-700" />
          <span>ESP32 Network Online</span>
        </div>

        {/* Test Simulator Trigger Button */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-2xs hover:shadow-xs group"
          title="Open IoT Sensor & Alert Simulator"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Simulate Hardware</span>
          <span className="sm:hidden">Simulate</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Active Colony Alerts</h4>
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                    {unreadAlertsCount} Unresolved
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowAlertMenu(false);
                    onNavigate('notifications');
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {alerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                    All hives operating in normal parameters!
                  </div>
                ) : (
                  alerts.map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        setShowAlertMenu(false);
                        onNavigate('notifications');
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {alt.hive_code}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{alt.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-600/30">
              {user.full_name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user.full_name}</p>
              <p className="text-[10px] text-slate-500 leading-none">Beekeeper</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Annual Plan Active
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-500" />
                  Account & Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('subscription');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Subscription Plans (₹999/yr)
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('help-docs');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  Hardware & Wiring Docs
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('login');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
