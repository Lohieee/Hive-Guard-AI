import React, { useState, useEffect } from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Scale,
  ThermometerSun,
  Droplets,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  Play,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { db } from '../services/mockDb';
import { sensorEngine } from '../services/sensorEngine';
import { Hive, SensorReading } from '../types';

interface LiveMonitoringPageProps {
  onNavigate: (route: string, hiveId?: string) => void;
  onOpenSimulator: () => void;
  selectedApiaryId: string;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  onNavigate,
  onOpenSimulator,
  selectedApiaryId,
}) => {
  const [hives, setHives] = useState<Hive[]>(db.getHives());
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [pulsingHiveId, setPulsingHiveId] = useState<string | null>(null);

  // Subscribe to real-time sensor updates
  useEffect(() => {
    const unsubscribe = sensorEngine.subscribe(({ reading }) => {
      setHives(db.getHives());
      setLastRefreshed(new Date());
      setPulsingHiveId(reading.hive_id);
      setTimeout(() => setPulsingHiveId(null), 1200);
    });

    return () => unsubscribe();
  }, []);

  const filteredHives = selectedApiaryId === 'all'
    ? hives
    : hives.filter((h) => h.apiary_id === selectedApiaryId);

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Page Title & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Live Real-Time IoT Telemetry Stream
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Colony Sensor Nodes
          </h1>
          <p className="text-xs text-slate-600">
            Microclimates broadcasted every 60 seconds from ESP32 DevKit nodes via encrypted TLS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Readings</span>
          </button>
          <button
            onClick={() => onNavigate('hives')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hive Node</span>
          </button>
        </div>
      </div>

      {/* Grid of Hive Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHives.map((hive) => {
          const reading = hive.current_reading || db.getLatestReading(hive.id);
          const device = hive.device;
          const isOnline = device?.connection_status === 'online';
          const isPulsing = pulsingHiveId === hive.id;
          const temp = reading ? reading.temperature_c : 35.0;
          const hum = reading ? reading.humidity_percent : 60.0;
          const weight = reading?.weight_kg || 24.5;
          const activity = reading?.activity_count || 120;
          const battery = device?.battery_level || 90;

          // Thermal status styling
          const isTempWarning = temp >= 37.0;
          const isTempCritical = temp >= 38.5;

          return (
            <div
              key={hive.id}
              className={`bg-white rounded-3xl border transition-all duration-300 shadow-xs hover:shadow-md overflow-hidden ${
                isPulsing ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[#E8E3D9]'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-[#FAF8F5]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-800 text-white tracking-wider">
                      {hive.hive_code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 truncate max-w-[160px]">
                      {hive.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                    <span>{hive.apiary_name}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-600">{device?.device_code || 'ESP32'}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={hive.risk_level || 'normal'} size="sm" pulse={isOnline} />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                      device?.is_simulated
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {device?.is_simulated ? 'Simulated Node' : 'Calibrated Node'}
                  </span>
                </div>
              </div>

              {/* Main Gauges & Sensor Data */}
              <div className="p-5 space-y-4">
                {/* 2 Big Sensor Gauges: Temp & Humidity */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Temperature Box */}
                  <div
                    className={`p-3.5 rounded-2xl border text-center transition-colors ${
                      isTempCritical
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : isTempWarning
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-[#FAF8F5] border-[#E8E3D9] text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <ThermometerSun className={`w-3.5 h-3.5 ${isTempWarning ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span>Brood Temp</span>
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-black">{temp.toFixed(1)}</span>
                      <span className="text-xs font-bold text-slate-500">°C</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {isTempCritical ? 'Critical Excursion!' : isTempWarning ? 'Warning Exceeded' : 'Optimum Brood (35°)'}
                    </span>
                  </div>

                  {/* Humidity Box */}
                  <div className="p-3.5 rounded-2xl border border-[#E8E3D9] bg-[#FAF8F5] text-center">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span>Humidity</span>
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-black text-slate-900">{hum.toFixed(1)}</span>
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {hum > 80 ? 'High Dampness' : hum < 45 ? 'Dry Air' : 'Comfort Band'}
                    </span>
                  </div>
                </div>

                {/* Secondary Sensor Rows: Weight & Activity */}
                <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600 py-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Scale className="w-3.5 h-3.5 text-purple-600" />
                      <span>Hive Gross Weight</span>
                    </span>
                    <span className="font-extrabold text-slate-900 font-mono">{weight.toFixed(2)} kg</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 py-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Flight Activity Count</span>
                    </span>
                    <span className="font-extrabold text-slate-900 font-mono">{activity} bees / hr</span>
                  </div>
                </div>

                {/* Node Telemetry / Health Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {isOnline ? (
                      <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span className="font-medium">{isOnline ? 'Wi-Fi Signal: -64dBm' : 'Node Stale/Offline'}</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    <Battery className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{battery}%</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {reading?.recorded_at
                      ? new Date(reading.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Just now'}
                  </span>
                </span>

                <button
                  onClick={() => onNavigate('hive-detail', hive.id)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1"
                >
                  <span>Detailed Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
