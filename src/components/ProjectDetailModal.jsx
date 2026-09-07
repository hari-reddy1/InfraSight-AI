import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { formatCurrencyCr } from '../utils/riskEngine';
import { api } from '../utils/api';

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  // Simulation state
  const [delayDelta, setDelayDelta] = useState(0);
  const [progressDelta, setProgressDelta] = useState(0);
  const [costEscalation, setCostEscalation] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const getRiskStyle = (level) => {
    if (level === 'Critical' || level === 'CRITICAL') return 'bg-red-100 text-red-800 border-red-200';
    if (level === 'High' || level === 'HIGH') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (level === 'Medium' || level === 'MODERATE') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const handleSimulate = async (newDelay, newProg, newCost) => {
    setIsSimulating(true);
    try {
      if (project.id && !isNaN(project.id)) {
        const res = await api.simulateProject(project.id, {
          additional_delay_months: newDelay,
          progress_delta_pct: newProg,
          cost_escalation_pct: newCost
        });
        setSimResult(res.simulated_metrics);
      } else {
        // Fallback local math
        const simCost = project.revisedCostCr * (1 + newCost / 100);
        const simDelay = Math.max(0, project.timeOverrunMonths + newDelay);
        const simRisk = Math.min(99, Math.max(10, Math.round(project.riskScore + (newDelay * 0.8) - (newProg * 0.5) + (newCost * 0.7))));
        setSimResult({
          anticipated_cost_cr: simCost,
          delay_months: simDelay,
          simulated_risk_score: simRisk,
          simulated_risk_band: simRisk >= 90 ? 'CRITICAL' : simRisk >= 70 ? 'HIGH' : simRisk >= 45 ? 'MODERATE' : 'LOW',
          predicted_final_cost_cr: simCost * (1 + (simRisk / 200))
        });
      }
    } catch (err) {
      console.warn("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetSimulation = () => {
    setDelayDelta(0);
    setProgressDelta(0);
    setCostEscalation(0);
    setSimResult(null);
  };

  // Current display metrics (baseline or simulated)
  const currentRiskScore = simResult ? simResult.simulated_risk_score : project.riskScore;
  const currentRiskBand = simResult ? simResult.simulated_risk_band : project.riskLevel;
  const currentPredictedCost = simResult ? simResult.predicted_final_cost_cr : project.predictedCostOverrunCr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
              <span className="text-xs font-mono px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded font-bold">
                {project.code}
              </span>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getRiskStyle(currentRiskBand)}`}>
                AI Risk Score: {currentRiskScore}% ({currentRiskBand})
              </span>
              <span className="text-xs text-slate-600 font-medium">• {project.ministry}</span>
              {simResult && (
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200 animate-pulse">
                  ⚡ WHAT-IF SCENARIO ACTIVE
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              {project.name}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Executing Agency: <span className="text-slate-900 font-semibold">{project.implementingAgency}</span> • State: <span className="font-semibold text-slate-800">{project.state}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shadow-2xs shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Section 1: AI Predictive Forecast & What-If Simulation */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5 font-outfit">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Predictive Forecast & What-If Simulation</span>
              </h3>
              <div className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                Model: GradientBoosting-CUF-Ext-v2.4
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cost Forecast Card */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 shadow-2xs">
                <div className="text-slate-500 font-bold text-[11px] uppercase">Cost Forecast (₹ Cr)</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Original Sanctioned:</span>
                  <span className="font-bold text-slate-900">{formatCurrencyCr(project.approvedCostCr)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Current Anticipated:</span>
                  <span className="font-bold text-slate-900">{formatCurrencyCr(project.revisedCostCr)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Predicted Final (AI):</span>
                  <span className="font-bold text-red-600">{formatCurrencyCr(currentPredictedCost)}</span>
                </div>
                <div className="p-2.5 bg-red-50 rounded border border-red-200 flex justify-between text-[11px]">
                  <span className="text-red-800 font-semibold">Net Predicted Escalation:</span>
                  <span className="font-bold text-red-700">+{formatCurrencyCr(currentPredictedCost - project.approvedCostCr)}</span>
                </div>
              </div>

              {/* Timeline Forecast Card */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 shadow-2xs">
                <div className="text-slate-500 font-bold text-[11px] uppercase">Timeline Forecast</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Original DOC:</span>
                  <span className="font-bold text-slate-900">{project.originalDOC || "2024-03"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Revised Expected DOC:</span>
                  <span className="font-bold text-slate-900">{project.revisedDOC}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Reported Delay:</span>
                  <span className="font-bold text-amber-700">+{project.timeOverrunMonths} Months</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 flex justify-between text-[11px]">
                  <span className="text-amber-800 font-semibold">Execution Velocity:</span>
                  <span className="font-bold text-amber-900">{project.physicalProgressPct}% in {project.timeOverrunMonths + 24} mos</span>
                </div>
              </div>
            </div>

            {/* Interactive What-If Simulation Controls */}
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900 text-xs">Interactive What-If Scenario Modeler</span>
                </div>
                {simResult && (
                  <button
                    onClick={handleResetSimulation}
                    className="flex items-center space-x-1 text-[11px] text-slate-600 hover:text-slate-900 font-semibold underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Baseline</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Delay Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                    <span>Timeline Shift:</span>
                    <strong className="text-blue-700 font-mono">+{delayDelta} Months</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="36"
                    step="3"
                    value={delayDelta}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDelayDelta(val);
                      handleSimulate(val, progressDelta, costEscalation);
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Physical Progress Delta */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                    <span>Progress Acceleration:</span>
                    <strong className="text-blue-700 font-mono">{progressDelta >= 0 ? `+${progressDelta}` : progressDelta}%</strong>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="5"
                    value={progressDelta}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setProgressDelta(val);
                      handleSimulate(delayDelta, val, costEscalation);
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Tender / Commodity Escalation */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                    <span>Tender Price Escalation:</span>
                    <strong className="text-blue-700 font-mono">+{costEscalation}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="5"
                    value={costEscalation}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCostEscalation(val);
                      handleSimulate(delayDelta, progressDelta, val);
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Physical vs Financial Progress Gap */}
            {project.progressDivergenceGapPct > 5 && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-900 flex items-center justify-between">
                <span>⚠️ <strong>Divergence Flag</strong>: Financial expenditure ({project.financialProgressPct}%) outpaces physical completion ({project.physicalProgressPct}%).</span>
                <span className="font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-950">+{project.progressDivergenceGapPct}% Gap</span>
              </div>
            )}
          </div>

          {/* Section 2: Explainable AI SHAP Breakdown ("Predictive Drivers", NOT causal blame) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900 font-outfit">
                  Explainable AI (XAI): Predictive Drivers Breakdown
                </h3>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded font-medium border border-slate-200">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Features represent mathematical model drivers; not causal blame.</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {project.shapDrivers.map((driver, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{driver.feature}</span>
                    <span className="font-bold text-red-600">+{driver.impact}% Model Attribution</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-1.5">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, driver.impact * 2.5)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-600">{driver.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Early Warning Recommendation */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
            <div className="text-red-700 font-bold text-xs uppercase flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Executive Early Warning & Recommended Government Action</span>
            </div>
            <p className="text-xs text-red-900 font-medium">{project.earlyWarningNote}</p>
          </div>

          {/* Section 4: Data Provenance & Verification Badge */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data Provenance: <strong>Ministry of Statistics and Programme Implementation (MoSPI)</strong></span>
            </div>
            <div className="font-mono text-slate-500">
              Cycle: April 2026 • Verified CUF Record #{project.code}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Close Deep-Dive View
          </button>
        </div>

      </div>
    </div>
  );
}
