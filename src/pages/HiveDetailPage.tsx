import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ThermometerSun,
  Droplets,
  Scale,
  Activity,
  Cpu,
  Wifi,
  Battery,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Calendar,
  Save,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { StatusBadge } from '../components/common/StatusBadge';
import { db } from '../services/mockDb';
import { sensorEngine } from '../services/sensorEngine';
import { Hive, AlertSettings, SensorReading } from '../types';

interface HiveDetailPageProps {
  hiveId: string;
  onNavigate: (route: string, hiveId?: string) => void;
  onOpenSimulator: () => void;
}

export const HiveDetailPage: React.FC<HiveDetailPageProps> = ({
  hiveId,
  onNavigate,
  onOpenSimulator,
}) => {
  const [hive, setHive] = useState<Hive | undefined>(db.getHiveById(hiveId) || db.getHives()[0]);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'thresholds' | 'inspections' | 'alerts'>('telemetry');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const initialSettings = useMemo(() => {
    return hive ? db.getAlertSettings(hive.id) : null;
  }, [hive]);

  const [settings, setSettings] = useState<AlertSettings | null>(initialSettings);

  const readings = useMemo(() => {
    return hive ? db.getReadings(hive.id, 48) : [];
  }, [hive]);

  const latestReading: SensorReading | undefined = hive?.current_reading || readings[readings.length - 1];
  const hiveAlerts = useMemo(() => {
    return hive ? db.getAlerts().filter((a) => a.hive_id === hive.id) : [];
  }, [hive]);
  const hiveInspections = useMemo(() => {
    return hive ? db.getInspections(hive.id) : [];
  }, [hive]);
  const hiveParasites = useMemo(() => {
    return hive ? db.getParasites(hive.id) : [];
  }, [hive]);

  if (!hive) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-600">Hive not found.</p>
        <button
          onClick={() => onNavigate('hives')}
          className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
        >
          Return to Hive List
        </button>
      </div>
    );
  }

  const chartData = readings.map((r) => {
    const d = new Date(r.recorded_at);
    return {
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: r.temperature_c,
      hum: r.humidity_percent,
      weight: r.weight_kg || 24.5,
      activity: r.activity_count || 0
    };
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    db.saveAlertSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('hives')}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-800 text-white">
                {hive.hive_code}
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{hive.name}</h1>
              <StatusBadge status={hive.risk_level || 'normal'} size="sm" pulse />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>{hive.apiary_name}</span>
              <span>•</span>
              <span className="italic">{hive.bee_species}</span>
              <span>•</span>
              <span>Installed {hive.installation_date}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Readings for this Hive</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <ThermometerSun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Brood Temp</span>
            <span className="text-xl font-extrabold text-slate-900">{latestReading?.temperature_c || 35.0}°C</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Relative Humidity</span>
            <span className="text-xl font-extrabold text-slate-900">{latestReading?.humidity_percent || 60}%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Load Cell Scale</span>
            <span className="text-xl font-extrabold text-slate-900">{latestReading?.weight_kg || 24.5} kg</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Flight Counter</span>
            <span className="text-xl font-extrabold text-slate-900">{latestReading?.activity_count || 120} /hr</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'telemetry'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Microclimate Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('thresholds')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'thresholds'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Alert Thresholds</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'inspections'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Inspections & Varroa ({hiveInspections.length + hiveParasites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'border-emerald-800 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Alert Logs ({hiveAlerts.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: TELEMETRY */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">24-Hour Temperature Telemetry (°C)</h3>
                <p className="text-[11px] text-slate-500">
                  Target Brood Zone: 34.5°C to 35.5°C | Current threshold: {settings?.temperature_warning}°C
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200">
                Latest: {latestReading?.temperature_c}°C
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1EDE4" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis domain={[30, 42]} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine y={34.5} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Brood Min (34.5°)', fill: '#10B981', fontSize: 10 }} />
                  <ReferenceLine y={35.5} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Brood Max (35.5°)', fill: '#10B981', fontSize: 10 }} />
                  <ReferenceLine y={settings?.temperature_warning || 37.0} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Warning', fill: '#F59E0B', fontSize: 10 }} />
                  <Area type="monotone" dataKey="temp" stroke="#D97706" fill="#FEF3C7" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Node Diagnostics */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8E3D9] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Paired Hardware</span>
              <p className="font-mono font-bold text-slate-900">{hive.device?.device_code || 'ESP32'}</p>
              <p className="text-slate-500 text-[11px]">Firmware {hive.device?.firmware_version || 'v1.2.0'}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Network Uplink</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wi-Fi / RSSI {hive.device?.signal_strength || -64} dBm</span>
              </p>
              <p className="text-slate-500 text-[11px]">Sampling every 60s</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Power Subsystem</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                <span>Battery Level {hive.device?.battery_level || 94}%</span>
              </p>
              <p className="text-slate-500 text-[11px]">Solar recharge active</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: THRESHOLDS */}
      {activeTab === 'thresholds' && settings && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Custom Hive Early-Warning Thresholds</h3>
            <p className="text-xs text-slate-500">
              Calibrate temperature and humidity limits for {hive.name} ({hive.bee_species}).
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Threshold settings successfully updated and synchronized!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <label className="block text-xs font-bold text-amber-950">
                Temperature Warning Threshold: {settings.temperature_warning}°C
              </label>
              <input
                type="range"
                min="35.0"
                max="38.0"
                step="0.1"
                value={settings.temperature_warning}
                onChange={(e) => setSettings({ ...settings, temperature_warning: parseFloat(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <p className="text-[11px] text-amber-800">Triggers cautionary notification and ventilation check.</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <label className="block text-xs font-bold text-rose-950">
                Critical Heat Threshold: {settings.temperature_critical}°C
              </label>
              <input
                type="range"
                min="37.5"
                max="40.0"
                step="0.1"
                value={settings.temperature_critical}
                onChange={(e) => setSettings({ ...settings, temperature_critical: parseFloat(e.target.value) })}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <p className="text-[11px] text-rose-800">Immediately dispatches urgent SMS to beekeeper mobile.</p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <label className="block text-xs font-bold text-sky-950">
                Relative Humidity Range: {settings.humidity_min}% to {settings.humidity_max}%
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={settings.humidity_min}
                  onChange={(e) => setSettings({ ...settings, humidity_min: parseFloat(e.target.value) })}
                  className="px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                />
                <input
                  type="number"
                  value={settings.humidity_max}
                  onChange={(e) => setSettings({ ...settings, humidity_max: parseFloat(e.target.value) })}
                  className="px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                />
              </div>
              <p className="text-[11px] text-sky-800">Humidity outside this band logs warning anomalies.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                SMS Alert Cooldown: {settings.cooldown_minutes} Minutes
              </label>
              <input
                type="number"
                min="10"
                max="180"
                value={settings.cooldown_minutes}
                onChange={(e) => setSettings({ ...settings, cooldown_minutes: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              />
              <p className="text-[11px] text-slate-500">Suppresses duplicate messages during sustained weather spikes.</p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Calibrated Thresholds</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: INSPECTIONS */}
      {activeTab === 'inspections' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Physical Inspections & Parasite Records</h3>
            <button
              onClick={() => onNavigate('parasite-inspection')}
              className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
            >
              + Record Inspection
            </button>
          </div>

          <div className="space-y-3">
            {hiveInspections.map((insp) => (
              <div key={insp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{insp.inspection_date} — Inspector: {insp.inspector_name}</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-white text-slate-700 font-semibold border border-slate-200">
                    Queen {insp.queen_spotted ? 'Spotted' : 'Unseen'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{insp.notes}</p>
              </div>
            ))}

            {hiveParasites.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">
                    Varroa Surveillance: {p.mite_count} mites / {p.sample_size} bees ({p.infestation_rate_pct}%)
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold">{new Date(p.observed_at).toLocaleDateString()}</span>
                </div>
                {p.treatment_applied && (
                  <p className="text-amber-900 font-medium">Treatment: {p.treatment_applied}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Colony Alert History</h3>
          <div className="space-y-2">
            {hiveAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No alert history recorded for this hive.</p>
            ) : (
              hiveAlerts.map((alt) => (
                <div key={alt.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{alt.alert_type}</span>
                      <StatusBadge status={alt.status} size="sm" />
                    </div>
                    <p className="text-slate-600 leading-relaxed">{alt.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
