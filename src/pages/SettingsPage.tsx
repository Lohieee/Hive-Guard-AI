import React, { useState } from 'react';
import {
  User,
  Bell,
  Sliders,
  Shield,
  CreditCard,
  Save,
  CheckCircle2,
  PhoneCall,
  Lock,
  LogOut,
  Trash2,
  Clock,
  Plus,
  X
} from 'lucide-react';
import { db } from '../services/mockDb';
import { authService } from '../services/supabaseClient';
import { NotificationPreferences, UserProfile } from '../types';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'monitoring' | 'security'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile State
  const [user, setUser] = useState<UserProfile>(db.getUser());

  // Notification State
  const [prefs, setPrefs] = useState<NotificationPreferences>(db.getNotificationPreferences());
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  // Monitoring State
  const [readingInterval, setReadingInterval] = useState(60);
  const [staleTimeout, setStaleTimeout] = useState(15);
  const [defaultCooldown, setDefaultCooldown] = useState(30);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUser(user);
    triggerSuccess();
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveNotificationPreferences(prefs);
    triggerSuccess();
  };

  const handleAddPhone = () => {
    if (!newPhoneNumber.trim()) return;
    const list = [...prefs.authorized_phone_numbers, newPhoneNumber.trim()];
    const updated = { ...prefs, authorized_phone_numbers: list };
    setPrefs(updated);
    db.saveNotificationPreferences(updated);
    setNewPhoneNumber('');
  };

  const handleRemovePhone = (index: number) => {
    const list = prefs.authorized_phone_numbers.filter((_, i) => i !== index);
    const updated = { ...prefs, authorized_phone_numbers: list };
    setPrefs(updated);
    db.saveNotificationPreferences(updated);
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-xs text-slate-600">
          Manage your beekeeper profile, emergency SMS recipient routing, quiet hours, and sensor intervals.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings successfully saved and synchronized!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>SMS & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'monitoring'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Monitoring & Timing</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Sessions</span>
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Beekeeper Profile Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={user.full_name}
                onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Phone Number
              </label>
              <input
                type="tel"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cooperative / Organization
              </label>
              <input
                type="text"
                value={user.organization || ''}
                onChange={(e) => setUser({ ...user, organization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: NOTIFICATIONS & SMS CONSENT */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900">SMS & Notification Preferences</h3>
            <p className="text-xs text-slate-500">Configure alert channels, recipient telephone numbers, and quiet hours.</p>
          </div>

          {/* Toggle Controls */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Automated SMS Text Alerts</span>
                <span className="text-[11px] text-slate-500">Dispatches real text messages via MSG91/Twilio during critical thermal spikes</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.sms_enabled}
                onChange={(e) => setPrefs({ ...prefs, sms_enabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-800 border-slate-300 focus:ring-emerald-700"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-xs text-slate-900 block">In-App Web Dashboard Alerts</span>
                <span className="text-[11px] text-slate-500">Shows live warning toasts and updates the notification bell</span>
              </div>
              <input
                type="checkbox"
                checked={prefs.in_app_enabled}
                onChange={(e) => setPrefs({ ...prefs, in_app_enabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-800 border-slate-300 focus:ring-emerald-700"
              />
            </label>
          </div>

          {/* Authorized Numbers */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Authorized Mobile Numbers for SMS ({prefs.authorized_phone_numbers.length})
            </label>

            <div className="flex gap-2">
              <input
                type="tel"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="+91 9845012345"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <button
                type="button"
                onClick={handleAddPhone}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Number</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {prefs.authorized_phone_numbers.map((phone, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-mono font-bold text-slate-800">{phone}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhone(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Explicit Consent Statement */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.sms_consent_given}
                onChange={(e) => setPrefs({ ...prefs, sms_consent_given: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-emerald-800 border-slate-300 focus:ring-emerald-700"
              />
              <div className="text-xs text-amber-950">
                <span className="font-bold block">Explicit Regulatory SMS Consent:</span>
                <span className="text-[11px] text-amber-900">
                  I give explicit permission to HIVEGUARD AI to send automated SMS notifications for environmental and colony safety alerts. I can revoke this consent at any time by toggling this checkbox.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Notification Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: MONITORING CADENCE */}
      {activeTab === 'monitoring' && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900">IoT Sensor Cadence & Timing</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block">Sensor Telemetry Broadcast Interval</label>
              <select
                value={readingInterval}
                onChange={(e) => setReadingInterval(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value={30}>Every 30 Seconds (High precision)</option>
                <option value={60}>Every 60 Seconds (Recommended)</option>
                <option value={300}>Every 5 Minutes (Solar low-power mode)</option>
              </select>
              <p className="text-[11px] text-slate-500">Configures ESP32 deep-sleep cycling.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-slate-800 block">Device Stale / Offline Timeout</label>
              <select
                value={staleTimeout}
                onChange={(e) => setStaleTimeout(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
              </select>
              <p className="text-[11px] text-slate-500">Triggers 'Node Disconnected' warning if no ping received.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Security & Credentials</h3>
            <p className="text-slate-500">Manage account authentication, active browser sessions, and sign out.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Signed in as: {user.email}</span>
              <span className="text-slate-500 text-[11px]">Password last changed 30 days ago</span>
            </div>
            <button
              onClick={() => onNavigate('forgot-password')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold hover:bg-slate-50"
            >
              Change Password
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-700 block">Sign Out of Apiary Console</span>
              <span className="text-slate-500 text-[11px]">Clears active session on this computer</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
