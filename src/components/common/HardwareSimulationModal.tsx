import React, { useState } from 'react';
import { X, Play, AlertTriangle, Flame, Droplets, Wind, WifiOff, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { sensorEngine, SimulationScenario } from '../../services/sensorEngine';
import { db } from '../../services/mockDb';

interface HardwareSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationTriggered?: (msg: string, isSMS: boolean) => void;
}

export const HardwareSimulationModal: React.FC<HardwareSimulationModalProps> = ({
  isOpen,
  onClose,
  onNotificationTriggered,
}) => {
  const hives = db.getHives();
  const [selectedHiveId, setSelectedHiveId] = useState<string>(hives[0]?.id || 'hive_01');
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    scenario: string;
    temp: number;
    hum: number;
    alertMessage?: string;
    smsDispatched: boolean;
    smsText?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleRunScenario = (scenario: SimulationScenario, name: string) => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = sensorEngine.triggerScenario(selectedHiveId, scenario);
      const isSMS = Boolean(res.alertResult.smsSent);

      setLastResult({
        scenario: name,
        temp: res.reading.temperature_c,
        hum: res.reading.humidity_percent,
        alertMessage: res.alertResult.alert?.message,
        smsDispatched: isSMS,
        smsText: res.alertResult.smsMessage
      });

      setIsSimulating(false);

      if (res.alertResult.triggered && onNotificationTriggered) {
        onNotificationTriggered(
          res.alertResult.alert?.message || `Sensor condition triggered: ${name}`,
          isSMS
        );
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-amber-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">IoT Hardware & Sensor Simulator</h3>
              <p className="text-xs text-amber-200/80">Simulate ESP32 readings, threshold breaches, and SMS alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Target Hive Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target Hive for Simulation
            </label>
            <select
              value={selectedHiveId}
              onChange={(e) => setSelectedHiveId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
            >
              {hives.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.hive_code} — {h.name} ({h.apiary_name})
                </option>
              ))}
            </select>
          </div>

          {/* Test Scenarios Grid */}
          <div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Test Scenario to Inject
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Scenario 1: Normal Thermoregulation */}
              <button
                disabled={isSimulating}
                onClick={() => handleRunScenario('normal', 'Normal Brood Thermoregulation')}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800">
                    Normal Thermoregulation
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Brood nest core at 35.0°C, 60% humidity. Biological comfort equilibrium.
                  </p>
                </div>
              </button>

              {/* Scenario 2: Heatwave Spike */}
              <button
                disabled={isSimulating}
                onClick={() => handleRunScenario('heatwave_spike', 'Critical Heatwave Spike (>39°C)')}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-rose-600 text-white mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 group-hover:text-rose-800">
                    Heatwave Spike (39.4°C)
                  </h4>
                  <p className="text-[11px] text-rose-800 mt-0.5">
                    Exceeds critical limit (38.5°C). Triggers urgent alert and beekeeper SMS.
                  </p>
                </div>
              </button>

              {/* Scenario 3: High Humidity Anomaly */}
              <button
                disabled={isSimulating}
                onClick={() => handleRunScenario('humidity_abnormal', 'Excessive Humidity (89.2%)')}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-amber-600 text-white mt-0.5">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 group-hover:text-amber-800">
                    Excessive Dampness (89.2%)
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Chalkbrood fungal risk alert. Checks bottom board drainage.
                  </p>
                </div>
              </button>

              {/* Scenario 4: Swarming Weight Drop */}
              <button
                disabled={isSimulating}
                onClick={() => handleRunScenario('swarm_event', 'Swarm Departure Event (-2.8kg)')}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-purple-600 text-white mt-0.5">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-950 group-hover:text-purple-800">
                    Swarm Departure (-2.8kg)
                  </h4>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    Rapid load cell weight loss + entrance activity surge.
                  </p>
                </div>
              </button>

              {/* Scenario 5: Chilling Risk */}
              <button
                disabled={isSimulating}
                onClick={() => handleRunScenario('chilling_risk', 'Brood Chilling Cold Drop (30.5°C)')}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/70 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-sky-600 text-white mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-950 group-hover:text-sky-800">
                    Brood Chilling (30.5°C)
                  </h4>
                  <p className="text-[11px] text-sky-800 mt-0.5">
                    Temperature drops below 32°C safety limit. Larval mortality danger.
                  </p>
                </div>
              </button>

              {/* Scenario 6: Device Disconnection */}
              <button
                disabled={isSimulating}
                onClick={() => handleRunScenario('device_offline', 'ESP32 Device Disconnected')}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-slate-600 text-white mt-0.5">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-700">
                    ESP32 Node Offline
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Simulates Wi-Fi loss, battery depletion, or antenna failure.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Last Simulation Outcome Banner */}
          {lastResult && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                  Simulation Injected: {lastResult.scenario}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {lastResult.temp}°C | {lastResult.hum}% RH
                </span>
              </div>

              {lastResult.alertMessage && (
                <div className="text-xs text-rose-800 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{lastResult.alertMessage}</span>
                </div>
              )}

              {lastResult.smsDispatched && (
                <div className="text-xs text-emerald-800 font-medium bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Automated SMS Dispatched via MSG91 Gateway:</span>
                    <p className="font-mono text-[11px] mt-0.5 text-emerald-900 bg-white/70 p-1.5 rounded border border-emerald-200">
                      "{lastResult.smsText}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Honest Transparency Note */}
          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Hardware Distinction:</strong> This simulation tool generates calibrated readings for development and demonstration testing. On live installations, real ESP32 nodes transmit DHT22, load cell, and IR flight counters over TLS to the ingestion endpoint.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">All events trigger real-time UI & database updates</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
