import React, { useState } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckSquare,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { db } from '../services/mockDb';
import { aiRiskService } from '../services/aiRiskService';
import { Hive, RiskAssessment } from '../types';

interface AiRiskAnalysisPageProps {
  onNavigate: (route: string, hiveId?: string) => void;
  selectedApiaryId: string;
}

export const AiRiskAnalysisPage: React.FC<AiRiskAnalysisPageProps> = ({
  onNavigate,
  selectedApiaryId,
}) => {
  const hives = db.getHives();
  const filteredHives = selectedApiaryId === 'all'
    ? hives
    : hives.filter((h) => h.apiary_id === selectedApiaryId);

  const [selectedHiveId, setSelectedHiveId] = useState<string>(filteredHives[0]?.id || 'hive_01');
  const [analyzing, setAnalyzing] = useState(false);
  const [assessments, setAssessments] = useState<RiskAssessment[]>(db.getRiskAssessments());

  const currentHive = hives.find((h) => h.id === selectedHiveId) || filteredHives[0];
  const activeAssessment = assessments.find((a) => a.hive_id === currentHive?.id) ||
    aiRiskService.analyzeHive(currentHive?.id || 'hive_01');

  const handleReanalyze = () => {
    if (!currentHive) return;
    setAnalyzing(true);
    setTimeout(() => {
      const updated = aiRiskService.analyzeHive(currentHive.id);
      setAssessments(db.getRiskAssessments());
      setAnalyzing(false);
    }, 700);
  };

  const riskBadgeStyles = {
    normal: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2, text: 'Normal Baseline' },
    warning: { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: AlertTriangle, text: 'Colony Warning' },
    high_risk: { bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertCircle, text: 'High Risk Intervention' },
    insufficient_data: { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: HelpCircle, text: 'Insufficient Readings' }
  }[activeAssessment.risk_level];

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-700" />
              <span>Colony Health Diagnostic Model</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Method: {activeAssessment.assessment_method === 'hybrid' ? 'AI-Assisted Hybrid Analysis' : 'Rule-Based Engine'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Colony Risk Analysis
          </h1>
          <p className="text-xs text-slate-600">
            Multi-factor analysis correlating microclimate thermal variance, dampness, and Varroa observations.
          </p>
        </div>

        <button
          disabled={analyzing}
          onClick={handleReanalyze}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 disabled:opacity-70"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
          <span>{analyzing ? 'Analyzing Telemetry...' : 'Re-Run Colony Analysis'}</span>
        </button>
      </div>

      {/* Hive Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filteredHives.map((h) => {
          const isSelected = h.id === selectedHiveId;
          const hiveRisk = assessments.find((a) => a.hive_id === h.id)?.risk_level || 'normal';
          return (
            <button
              key={h.id}
              onClick={() => setSelectedHiveId(h.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span>{h.hive_code}</span>
              <span className="text-[11px] opacity-80">{h.name}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  hiveRisk === 'normal'
                    ? 'bg-emerald-400'
                    : hiveRisk === 'warning'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Main Explainable Assessment Card */}
      <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl border ${riskBadgeStyles.bg} flex items-center justify-center shrink-0`}
            >
              <riskBadgeStyles.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentHive?.name} ({currentHive?.hive_code})
                </h2>
                <StatusBadge status={activeAssessment.risk_level} size="md" pulse />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated: {new Date(activeAssessment.assessed_at).toLocaleString()} • Confidence Score:{' '}
                <strong>{Math.round((activeAssessment.confidence_score || 0.9) * 100)}%</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              {activeAssessment.assessment_method === 'hybrid' ? 'Model: Microclimate Hybrid-V2' : 'Rule-Based Engine'}
            </span>
          </div>
        </div>

        {/* Explainable Summary */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 leading-relaxed space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
            Analytical Summary:
          </span>
          <p className="font-medium text-slate-900">{activeAssessment.summary}</p>
        </div>

        {/* Contributing Factors & Observations */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>Contributing Observations & Sensor Evidence</span>
            <span className="text-xs text-slate-400 font-normal">({activeAssessment.contributing_factors.length} signals detected)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAssessment.contributing_factors.map((factor, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action Checklist */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-800" />
            <span>Recommended Beekeeper Action Checklist</span>
          </h3>

          <div className="space-y-2">
            {activeAssessment.recommended_actions.map((action, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs text-emerald-950 flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  id={`act_${idx}`}
                  className="w-4 h-4 rounded text-emerald-800 border-slate-300 focus:ring-emerald-700 cursor-pointer"
                />
                <label htmlFor={`act_${idx}`} className="cursor-pointer font-medium leading-relaxed">
                  {action}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific Transparency Notice */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Scientific Distinction Notice:</strong> Sensor readings provide correlated microclimate telemetry (brood thermoregulation stability, relative humidity moisture, and scale weight). While abnormal thermal swings correlate strongly with brood distress, definitive Varroa or pathogen confirmation requires physical alcohol wash inspection.
          </div>
        </div>
      </div>
    </div>
  );
};
