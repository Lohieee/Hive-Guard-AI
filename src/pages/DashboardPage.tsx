import React, { useState, useMemo } from 'react';
import {
  Activity,
  Layers,
  Wifi,
  AlertTriangle,
  Flame,
  Droplets,
  Scale,
  BrainCircuit,
  Filter,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { db } from '../services/mockDb';
import { Hive, SensorReading, AlertItem } from '../types';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onOpenSimulator: () => void;
  selectedApiaryId: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenSimulator,
  selectedApiaryId,
}) => {
  const [timeFilter, setTimeFilter] = useState<'1h' | '24h' | '7d' | '30d' | 'custom'>('24h');
  const [selectedHiveId, setSelectedHiveId] = useState<string>('all');

  const allHives = db.getHives();
  const apiaries = db.getApiaries();
  const alerts = db.getAlerts();

  // Filter hives based on active Apiary selector
  const filteredHives = useMemo(() => {
    if (selectedApiaryId === 'all') return allHives;
    return allHives.filter((h) => h.apiary_id === selectedApiaryId);
  }, [allHives, selectedApiaryId]);

  // Primary hive for chart telemetry
  const activeHive: Hive = useMemo(() => {
    if (selectedHiveId !== 'all') {
      const found = filteredHives.find((h) => h.id === selectedHiveId);
      if (found) return found;
    }
    return filteredHives[0] || allHives[0];
  }, [filteredHives, selectedHiveId, allHives]);

  // Telemetry time series for selected hive
  const readings = useMemo(() => {
    if (!activeHive) return [];
    const limit = timeFilter === '1h' ? 12 : timeFilter === '24h' ? 48 : 96;
    return db.getReadings(activeHive.id, limit);
  }, [activeHive, timeFilter]);

  const latestReading: SensorReading | undefined = activeHive?.current_reading || readings[readings.length - 1];

  // Summary Metrics Calculations
  const totalApiaries = selectedApiaryId === 'all' ? apiaries.length : 1;
  const totalHives = filteredHives.length;
  const onlineHives = filteredHives.filter((h) => h.device?.connection_status === 'online').length;
  const activeAlerts = alerts.filter(
    (a) => a.status === 'active' && filteredHives.some((h) => h.id === a.hive_id)
  );
  const hivesRequiringInspection = filteredHives.filter(
    (h) => h.risk_level === 'high_risk' || h.risk_level === 'warning' || (h.active_alerts_count || 0) > 0
  ).length;

  // Chart data formatting
  const chartData = useMemo(() => {
    return readings.map((r) => {
      const d = new Date(r.recorded_at);
      const timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        time: timeLabel,
        temperature: r.temperature_c,
        humidity: r.humidity_percent,
        weight: r.weight_kg || 24.5,
        activity: r.activity_count || 0,
      };
    });
  }, [readings]);

  // Colony Risk Distribution Pie Chart Data
  const riskDistributionData = useMemo(() => {
    const normalCount = filteredHives.filter((h) => h.risk_level === 'normal' || !h.risk_level).length;
    const warningCount = filteredHives.filter((h) => h.risk_level === 'warning').length;
    const highRiskCount = filteredHives.filter((h) => h.risk_level === 'high_risk').length;
    const insufficientCount = filteredHives.filter((h) => h.risk_level === 'insufficient_data').length;

    return [
      { name: 'Normal', value: normalCount, color: '#10B981' },
      { name: 'Warning', value: warningCount, color: '#F59E0B' },
      { name: 'High Risk', value: highRiskCount, color: '#EF4444' },
      { name: 'Insufficient Data', value: insufficientCount, color: '#94A3B8' },
    ].filter((item) => item.value > 0);
  }, [filteredHives]);

  // Alert History by Type
  const alertTypeDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      'Temp Warning': 0,
      'Critical Temp': 0,
      'Humidity Anomaly': 0,
      'Parasite Concern': 0,
      'Swarm/Weight': 0,
    };
    alerts.forEach((alt) => {
      if (alt.alert_type === 'temperature_warning') counts['Temp Warning']++;
      else if (alt.alert_type === 'critical_temperature') counts['Critical Temp']++;
      else if (alt.alert_type === 'humidity_anomaly') counts['Humidity Anomaly']++;
      else if (alt.alert_type === 'parasite_concern') counts['Parasite Concern']++;
      else if (alt.alert_type === 'weight_loss_swarm') counts['Swarm/Weight']++;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [alerts]);

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#1b4332] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-honeycomb-dark opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Colony Health Sentinel Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome to HIVEGUARD AI
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Monitor your colonies, identify unusual conditions, and respond before problems escalate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenSimulator}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Test Hardware Simulator</span>
            </button>
            <button
              onClick={() => onNavigate('live-monitoring')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>Live Telemetry Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="Total Apiaries"
          value={totalApiaries}
          icon={Layers}
          accentColor="slate"
          subtitle="Registered yards"
          onClick={() => onNavigate('hives')}
        />
        <MetricCard
          title="Registered Hives"
          value={totalHives}
          icon={Layers}
          accentColor="emerald"
          trend={{ value: '+2 new', isPositive: true }}
          onClick={() => onNavigate('hives')}
        />
        <MetricCard
          title="Hives Online"
          value={`${onlineHives}/${totalHives}`}
          icon={Wifi}
          accentColor="emerald"
          subtitle="ESP32 telemetry active"
          onClick={() => onNavigate('live-monitoring')}
        />
        <MetricCard
          title="Needs Inspection"
          value={hivesRequiringInspection}
          icon={AlertTriangle}
          accentColor={hivesRequiringInspection > 0 ? 'amber' : 'emerald'}
          subtitle="Elevated risk/alerts"
          onClick={() => onNavigate('ai-risk')}
        />
        <MetricCard
          title="Active Alerts"
          value={activeAlerts.length}
          icon={ShieldAlert}
          accentColor={activeAlerts.length > 0 ? 'rose' : 'emerald'}
          trend={{ value: activeAlerts.length > 0 ? 'Urgent' : 'All Clear', isPositive: activeAlerts.length === 0 }}
          onClick={() => onNavigate('notifications')}
        />
        <MetricCard
          title="Normal Status"
          value={`${Math.round(((totalHives - hivesRequiringInspection) / (totalHives || 1)) * 100)}%`}
          icon={BrainCircuit}
          accentColor="emerald"
          subtitle="Stable microclimate"
          onClick={() => onNavigate('ai-risk')}
        />
      </div>

      {/* Global Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Hive Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hive Focus:</span>
            <select
              value={selectedHiveId}
              onChange={(e) => setSelectedHiveId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
            >
              <option value="all">Compare All / Primary ({activeHive?.hive_code})</option>
              {filteredHives.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.hive_code} — {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hardware vs Simulation Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-slate-50 text-slate-700 border-slate-200">
            <span
              className={`w-2 h-2 rounded-full ${
                activeHive?.device?.is_simulated ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span>
              {activeHive?.device?.is_simulated ? 'Demonstration / Simulated Stream' : 'Live Hardware Stream'}
            </span>
          </div>
        </div>

        {/* Global Time Filter */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8E3D9]">
          <span className="text-[10px] font-bold text-slate-400 uppercase px-2 hidden sm:inline">Range:</span>
          {(['1h', '24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeFilter === t
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === '1h' ? '1 Hour' : t === '24h' ? '24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Latest Sensor Reading Highlight Pill */}
      {latestReading && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  {activeHive?.name} ({activeHive?.hive_code})
                </span>
                <StatusBadge status={activeHive?.risk_level || 'normal'} size="sm" pulse />
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Last Telemetry Received: {new Date(latestReading.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <span className="mx-1">•</span>
                <span className="font-mono text-emerald-800 font-bold">{activeHive?.device?.device_code}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <div className="text-right">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Internal Temp</span>
              <span className="font-extrabold text-lg text-slate-900">{latestReading.temperature_c}°C</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Humidity</span>
              <span className="font-extrabold text-lg text-slate-900">{latestReading.humidity_percent}%</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Hive Weight</span>
              <span className="font-extrabold text-lg text-slate-900">{latestReading.weight_kg || 24.5} kg</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Bee Activity</span>
              <span className="font-extrabold text-lg text-slate-900">{latestReading.activity_count || 120} /hr</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Temperature Over Time */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Brood Temperature Telemetry (°C)</h3>
                <p className="text-[11px] text-slate-500">
                  Target Brood Zone: 34.5°C – 35.5°C | Warning threshold: 37.0°C
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
              {latestReading?.temperature_c}°C
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                  formatter={(val: any) => [`${val} °C`, 'Temperature']}
                />
                {/* Biological Reference Thresholds */}
                <ReferenceLine y={34.5} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Brood Min (34.5°)', fill: '#10B981', fontSize: 10 }} />
                <ReferenceLine y={35.5} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Brood Max (35.5°)', fill: '#10B981', fontSize: 10 }} />
                <ReferenceLine y={37.0} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Warning (37°)', fill: '#EF4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="temperature" stroke="#D97706" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Relative Humidity Over Time */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Relative Humidity Telemetry (%)</h3>
                <p className="text-[11px] text-slate-500">Comfort envelope: 50% – 75% | Chalkbrood risk: &gt;80%</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
              {latestReading?.humidity_percent}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EDE4" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[30, 95]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} %`, 'Relative Humidity']}
                />
                <ReferenceLine y={50} stroke="#10B981" strokeDasharray="3 3" />
                <ReferenceLine y={75} stroke="#10B981" strokeDasharray="3 3" />
                <ReferenceLine y={85} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Chalkbrood Damp (>85%)', fill: '#EF4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="humidity" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#humGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Hive Weight Trends (Load Cell) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Hive Weight & Honey Super Gains (kg)</h3>
                <p className="text-[11px] text-slate-500">HX711 Load Cell scale | Swarm loss trigger: -1.5kg drop</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
              {latestReading?.weight_kg || 24.5} kg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EDE4" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} kg`, 'Total Weight']}
                />
                <Line type="monotone" dataKey="weight" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Bee Entrance Flight Activity (IR Counter) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Entrance Flight Activity Index</h3>
                <p className="text-[11px] text-slate-500">Optical IR beam counter | Forager departure/return counts</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
              {latestReading?.activity_count || 120} / hr
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EDE4" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} counts/hr`, 'Bee Activity']}
                />
                <Bar dataKey="activity" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution & Alert History Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Colony Health Distribution</h3>
            <button
              onClick={() => onNavigate('ai-risk')}
              className="text-xs text-emerald-800 font-bold hover:underline"
            >
              Analyze
            </button>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {riskDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value} hives</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert History by Category */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E3D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Alert Frequency by Category</h3>
              <p className="text-[11px] text-slate-500">Historical triggers logged across all registered hives</p>
            </div>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTypeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EDE4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
