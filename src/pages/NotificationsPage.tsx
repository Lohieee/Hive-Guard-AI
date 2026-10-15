import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  PhoneCall,
  Clock,
  Filter,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { db } from '../services/mockDb';
import { AlertItem, NotificationLog } from '../types';

interface NotificationsPageProps {
  onNavigate: (route: string, hiveId?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(db.getAlerts());
  const [logs, setLogs] = useState<NotificationLog[]>(db.getNotificationLogs());
  const [activeTab, setActiveTab] = useState<'alerts' | 'sms_logs'>('alerts');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchesStat = filterStatus === 'all' || a.status === filterStatus;
    return matchesSev && matchesStat;
  });

  const handleAcknowledge = (alertId: string) => {
    db.updateAlertStatus(alertId, 'acknowledged');
    setAlerts(db.getAlerts());
  };

  const handleResolve = (alertId: string) => {
    db.updateAlertStatus(alertId, 'resolved');
    setAlerts(db.getAlerts());
  };

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Alert & Notification Center
          </h1>
          <p className="text-xs text-slate-600">
            Real-time threshold triggers, beekeeper acknowledgment tracking, and SMS transmission logs.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'alerts'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In-App Alerts ({alerts.filter((a) => a.status === 'active').length} Active)
          </button>
          <button
            onClick={() => setActiveTab('sms_logs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sms_logs'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span>SMS Delivery Logs ({logs.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'alerts' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Severity:</span>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-500">
              Showing {filteredAlerts.length} of {alerts.length} notifications
            </span>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#E8E3D9] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">No matching alerts found</h3>
                <p className="text-xs text-slate-500">All registered hives operating within calibrated thresholds.</p>
              </div>
            ) : (
              filteredAlerts.map((alt) => {
                const isCritical = alt.severity === 'critical';
                const isWarning = alt.severity === 'warning';
                const isResolved = alt.status === 'resolved';

                return (
                  <div
                    key={alt.id}
                    className={`bg-white rounded-3xl border transition-all p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isResolved
                        ? 'border-slate-200 opacity-80'
                        : isCritical
                        ? 'border-rose-300 ring-1 ring-rose-300/40'
                        : 'border-amber-300 ring-1 ring-amber-300/40'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                          isResolved
                            ? 'bg-slate-100 text-slate-500'
                            : isCritical
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {isCritical ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white">
                            {alt.hive_code}
                          </span>
                          <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                            {alt.alert_type.replace('_', ' ')}
                          </span>
                          <StatusBadge status={alt.status} size="sm" />
                          {alt.measured_value && (
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">
                              (Measured: {alt.measured_value})
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{alt.message}</p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(alt.created_at).toLocaleString()}</span>
                          </span>
                          {alt.acknowledged_at && (
                            <span>Acknowledged: {new Date(alt.acknowledged_at).toLocaleTimeString()}</span>
                          )}
                          {alt.resolved_at && (
                            <span className="text-emerald-700 font-semibold">Resolved: {new Date(alt.resolved_at).toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onNavigate('hive-detail', alt.hive_id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View Hive
                      </button>

                      {alt.status === 'active' && (
                        <button
                          onClick={() => handleAcknowledge(alt.id)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {alt.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolve(alt.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* SMS Delivery Logs Tab */
        <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-xs overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">SMS Gateway Dispatch Logs</h3>
              <p className="text-xs text-slate-500">
                Audited text messages transmitted via MSG91 / Twilio SMS gateway to authorized numbers
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Provider: MSG91 Flow
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-500">No SMS messages logged yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                        <span>{log.recipient}</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-600">{log.provider} Gateway</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          log.delivery_status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : log.delivery_status === 'provider_not_configured'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {log.delivery_status === 'delivered'
                          ? '✓ Delivered'
                          : log.delivery_status === 'provider_not_configured'
                          ? 'Provider Not Configured'
                          : log.delivery_status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className="font-mono text-[11px] text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                    "{log.message_content}"
                  </p>

                  {log.provider_message_id && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Request Reference: {log.provider_message_id}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
