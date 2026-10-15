import React, { useState } from 'react';
import {
  Bug,
  Plus,
  Upload,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
  Camera,
  X,
  Clock,
  Info
} from 'lucide-react';
import { db } from '../services/mockDb';
import { ParasiteObservation, Inspection } from '../types';

interface ParasiteMonitoringPageProps {
  onNavigate: (route: string, hiveId?: string) => void;
  selectedApiaryId: string;
}

export const ParasiteMonitoringPage: React.FC<ParasiteMonitoringPageProps> = ({
  onNavigate,
  selectedApiaryId,
}) => {
  const hives = db.getHives();
  const filteredHives = selectedApiaryId === 'all'
    ? hives
    : hives.filter((h) => h.apiary_id === selectedApiaryId);

  const [observations, setObservations] = useState<ParasiteObservation[]>(db.getParasites());
  const [inspections, setInspections] = useState<Inspection[]>(db.getInspections());

  // Modal State
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  // Form State for Parasite Observation
  const [targetHiveId, setTargetHiveId] = useState(filteredHives[0]?.id || 'hive_01');
  const [method, setMethod] = useState<'alcohol_wash' | 'sugar_shake' | 'sticky_board' | 'visual_inspection' | 'ai_vision'>('sugar_shake');
  const [miteCount, setMiteCount] = useState(5);
  const [sampleSize, setSampleSize] = useState(300);
  const [treatment, setTreatment] = useState('Formic acid vaporization pad');

  // AI Vision Upload Simulator State
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [detectedAiMites, setDetectedAiMites] = useState<{ count: number; boxes: any[] } | null>(null);
  const [beekeeperConfirmed, setBeekeeperConfirmed] = useState(true);

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local URL
      const url = URL.createObjectURL(file);
      setUploadedImagePreview(url);
      setAiAnalyzing(true);

      // Simulate Computer Vision Candidate Detection
      setTimeout(() => {
        setAiAnalyzing(false);
        setDetectedAiMites({
          count: 7,
          boxes: [
            { x: 30, y: 40, width: 35, height: 35, score: 0.94 },
            { x: 65, y: 55, width: 32, height: 32, score: 0.91 },
            { x: 45, y: 75, width: 30, height: 30, score: 0.88 }
          ]
        });
        setMiteCount(7);
      }, 1200);
    }
  };

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(((miteCount / (sampleSize || 300)) * 100).toFixed(2));
    const hive = hives.find((h) => h.id === targetHiveId);

    db.createParasiteObservation({
      hive_id: targetHiveId,
      hive_code: hive?.hive_code,
      parasite_type: 'Varroa destructor',
      observation_method: method,
      mite_count: miteCount,
      sample_size: sampleSize,
      infestation_rate_pct: rate,
      image_path: uploadedImagePreview || undefined,
      model_result: detectedAiMites ? { detected_mites_count: detectedAiMites.count, confidence: 0.92 } : undefined,
      beekeeper_confirmed: beekeeperConfirmed,
      treatment_applied: treatment,
      observed_at: new Date().toISOString()
    });

    setObservations(db.getParasites());
    setShowObservationModal(false);
    setUploadedImagePreview(null);
    setDetectedAiMites(null);
  };

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Parasite Surveillance & Hive Inspection
          </h1>
          <p className="text-xs text-slate-600">
            Track Varroa destructor infestation rates (alcohol wash, sugar shake, AI vision) and colony management actions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowObservationModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Record Varroa Observation</span>
          </button>
        </div>
      </div>

      {/* Varroa Severity Threshold Reference Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950">&lt; 1.0% Infestation</span>
            <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">Low Baseline</span>
          </div>
          <p className="text-emerald-800 text-[11px]">Under 3 mites / 300 bees. Colony in healthy equilibrium. Continue monitoring.</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950">2.0% – 3.0% Infestation</span>
            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">Action Threshold</span>
          </div>
          <p className="text-amber-800 text-[11px]">6 to 9 mites / 300 bees. Plan organic treatment (Formic / Oxalic acid).</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-950">&gt; 3.0% Infestation</span>
            <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px]">Critical Danger</span>
          </div>
          <p className="text-rose-800 text-[11px]">Over 9 mites / 300 bees. Imminent colony collapse or DWV outbreak. Immediate treatment mandatory.</p>
        </div>
      </div>

      {/* Observation History Table */}
      <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Parasite Surveillance Logs</h3>
            <p className="text-xs text-slate-500">Documented mite counts, sample sizes, and beekeeper treatments</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{observations.length} Records</span>
        </div>

        <div className="divide-y divide-slate-100">
          {observations.map((obs) => {
            const isHigh = obs.infestation_rate_pct >= 3.0;
            const isWarning = obs.infestation_rate_pct >= 2.0 && obs.infestation_rate_pct < 3.0;

            return (
              <div key={obs.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                      isHigh ? 'bg-rose-100 text-rose-800' : isWarning ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <Bug className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white">
                        {obs.hive_code || 'HG-001'}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{obs.parasite_type}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isHigh
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : isWarning
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {obs.infestation_rate_pct}% Rate ({obs.mite_count} mites / {obs.sample_size} bees)
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                      <span className="capitalize">Method: {obs.observation_method.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{new Date(obs.observed_at).toLocaleDateString()}</span>
                      {obs.model_result && (
                        <>
                          <span>•</span>
                          <span className="text-purple-700 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Vision Assisted</span>
                          </span>
                        </>
                      )}
                    </p>

                    {obs.treatment_applied && (
                      <div className="mt-2 text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 inline-block text-slate-800 font-medium">
                        <strong>Treatment:</strong> {obs.treatment_applied}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className="text-[11px] text-slate-400">
                    Confirmed by Beekeeper: {obs.beekeeper_confirmed ? 'Yes' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Record Varroa Observation */}
      {showObservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900">Record Varroa Parasite Observation</h3>
              </div>
              <button onClick={() => setShowObservationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveObservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Hive *
                </label>
                <select
                  value={targetHiveId}
                  onChange={(e) => setTargetHiveId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {filteredHives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hive_code} — {h.name} ({h.apiary_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Observation Method
                  </label>
                  <select
                    value={method}
                    onChange={(e: any) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="sugar_shake">Sugar Shake (Live bee safe)</option>
                    <option value="alcohol_wash">Alcohol Wash (Most accurate)</option>
                    <option value="sticky_board">Sticky Bottom Board</option>
                    <option value="visual_inspection">Visual Comb Inspection</option>
                    <option value="ai_vision">AI Camera Frame Scan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mites Counted
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={miteCount}
                    onChange={(e) => setMiteCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sample Size (Number of Bees Sampled)
                </label>
                <input
                  type="number"
                  min="50"
                  max="600"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(parseInt(e.target.value) || 300)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard sample: 300 bees (approx. 1/2 cup) = <strong>{((miteCount / sampleSize) * 100).toFixed(2)}% Infestation</strong>
                </p>
              </div>

              {/* AI Vision Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    <span>Optional AI Image-Assisted Mite Detection</span>
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">Beta</span>
                </div>
                <p className="text-[11px] text-purple-900/80 leading-relaxed">
                  Upload a clear macro photo of your sticky board or alcohol wash tray for automated candidate region detection.
                </p>

                <div className="pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-purple-300 text-xs font-bold text-purple-900 hover:bg-purple-100/50 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Tray Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulatedImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadedImagePreview && (
                  <div className="mt-2 p-2 bg-white rounded-xl border border-purple-200 relative">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded frame"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {aiAnalyzing ? (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-xs font-bold gap-2">
                        <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                        <span>AI Scanning for Varroa Candidates...</span>
                      </div>
                    ) : detectedAiMites ? (
                      <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        ✓ AI Identified {detectedAiMites.count} Candidate Mite Regions (Confidence: 92%). Review and confirm count above.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment or Follow-Up Action
                </label>
                <input
                  type="text"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g. Oxalic acid dribble, Formic pad, or None required"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowObservationModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
