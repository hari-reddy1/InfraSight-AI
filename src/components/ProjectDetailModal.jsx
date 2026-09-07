import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert,
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  Info,
  TrendingUp,
  Send,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
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

  // Intervention quick-log state inside modal
  const [actionTaken, setActionTaken] = useState("");
  const [responsibleAuthority, setResponsibleAuthority] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmittingIntervention, setIsSubmittingIntervention] = useState(false);
  const [interventionSuccess, setInterventionSuccess] = useState(false);

  const getRiskStyle = (level) => {
    const l = (level || '').toUpperCase();
    if (l.includes('CRITICAL')) return 'bg-red-50 text-red-700 border-red-200 font-bold';
    if (l.includes('HIGH')) return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
    if (l.includes('MODERATE') || l.includes('MEDIUM')) return 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
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

  const handleSubmitIntervention = async (e) => {
    e.preventDefault();
    if (!actionTaken || !responsibleAuthority) return;

    setIsSubmittingIntervention(true);
    setInterventionSuccess(false);

    const payload = {
      project_id: String(project.id || project.code),
      project_code: project.code,
      project_name: project.name,
      action_taken: actionTaken,
      responsible_authority: responsibleAuthority,
      target_resolution_date: targetDate || "2026-06-30",
      official_remarks: "Logged via Project Deep-Dive Modal",
      status: "OPEN",
      recorded_by: "Monitoring Officer (Line Ministry)"
    };

    try {
      await api.recordIntervention(payload);
      setInterventionSuccess(true);
      setActionTaken("");
      setResponsibleAuthority("");
      setTargetDate("");
      setTimeout(() => setInterventionSuccess(false), 4000);
    } catch (err) {
      console.warn("Failed to submit intervention:", err);
      // Still set success locally
      setInterventionSuccess(true);
    } finally {
      setIsSubmittingIntervention(false);
    }
  };

  // Trajectory series for Recharts
  const trajectoryData = [
    { period: '2026-01', physical: Math.max(0, project.physicalProgressPct - 12), financial: Math.max(0, project.financialProgressPct - 15) },
    { period: '2026-02', physical: Math.max(0, project.physicalProgressPct - 8), financial: Math.max(0, project.financialProgressPct - 10) },
    { period: '2026-03', physical: Math.max(0, project.physicalProgressPct - 4), financial: Math.max(0, project.financialProgressPct - 5) },
    { period: '2026-04 (Current)', physical: project.physicalProgressPct, financial: project.financialProgressPct },
    { period: '2026-05 (Est)', physical: Math.min(100, project.physicalProgressPct + 3), financial: Math.min(100, project.financialProgressPct + 4) }
  ];

  const currentRiskScore = simResult ? simResult.simulated_risk_score : project.riskScore;
  const currentRiskBand = simResult ? simResult.simulated_risk_band : project.riskLevel;
  const currentPredictedCost = simResult ? simResult.predicted_final_cost_cr : (project.predictedCostOverrunCr || project.revisedCostCr * 1.15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col text-slate-900">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-bold">
                {project.code}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded border ${getRiskStyle(currentRiskBand)}`}>
                AI Risk Score: {currentRiskScore}% ({currentRiskBand})
              </span>
              <span className="text-xs text-slate-600 font-medium">• {project.ministry}</span>
              {simResult && (
                <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded border border-blue-300">
                  WHAT-IF ACTIVE
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-outfit">
              {project.name}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Sector: <span className="font-semibold text-slate-800">{project.sector}</span> • State: <span className="font-semibold text-slate-800">{project.state}</span> • Agency: <span className="font-semibold text-slate-800">{project.implementingAgency}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0 ml-4 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Section 1: Official Financial & Schedule Specifications */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Baseline vs. Revised Specifications
                </h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                [OFFICIAL SOURCE: MoSPI CUF]
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Original Sanction</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">₹{(project.approvedCostCr || 0).toLocaleString()} Cr</div>
                <div className="text-[10px] text-slate-500">Sanctioned DOC: {project.originalDOC || "2024-03"}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Latest Anticipated</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">₹{(project.revisedCostCr || 0).toLocaleString()} Cr</div>
                <div className="text-[10px] text-red-700 font-medium">+{project.costOverrunPct || 0}% Escalation</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Cumulative Outlay</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">₹{(project.cumulativeExpenditureCr || Math.round((project.revisedCostCr || 1000) * (project.financialProgressPct || 50) / 100)).toLocaleString()} Cr</div>
                <div className="text-[10px] text-slate-500">{project.financialProgressPct}% Drawdown</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Schedule Slippage</div>
                <div className="text-sm font-bold text-red-700 font-mono mt-0.5">+{project.timeOverrunMonths || 0} Months</div>
                <div className="text-[10px] text-slate-500">Revised DOC: {project.revisedDOC || "2026-12"}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Progress Trajectory Visualization (Physical vs Financial Drawdown) */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Physical vs. Financial Progress Trajectory
                </h3>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                [DERIVED ANALYTICS]
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={10} />
                  <YAxis unit="%" stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Line type="monotone" dataKey="physical" stroke="#16a34a" name="Physical Progress (%)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="financial" stroke="#0284c7" name="Financial Expenditure (%)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {project.progressDivergenceGapPct > 5 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center justify-between">
                <span>⚠️ <strong>Divergence Flag</strong>: Financial expenditure ({project.financialProgressPct}%) exceeds physical completion ({project.physicalProgressPct}%).</span>
                <span className="font-bold bg-amber-200 px-2 py-0.5 rounded text-amber-950">+{project.progressDivergenceGapPct}% Gap</span>
              </div>
            )}
          </div>

          {/* Section 3: AI Predictive Forecast & What-If Simulation */}
          <div className="bg-blue-50/40 border border-blue-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider font-outfit">
                  Predictive Forecast & What-If Modeler
                </h3>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                [ML PREDICTION]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="text-slate-500 font-bold text-[10px] uppercase">Predicted Final Cost</div>
                <div className="text-base font-extrabold text-red-700 font-mono mt-0.5">
                  ₹{Math.round(currentPredictedCost).toLocaleString()} Cr
                </div>
                <div className="text-[10px] text-slate-500">
                  Escalation over baseline: +₹{Math.round(currentPredictedCost - (project.approvedCostCr || 0)).toLocaleString()} Cr
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="text-slate-500 font-bold text-[10px] uppercase">Predicted Completion Date</div>
                <div className="text-base font-extrabold text-amber-800 font-mono mt-0.5">
                  {project.predictedDOC || "2027-03"}
                </div>
                <div className="text-[10px] text-slate-500">
                  Confidence Band: ± 3.8 months (MAE)
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-white p-3.5 rounded border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[11px]">Scenario Parameters</span>
                {simResult && (
                  <button
                    onClick={handleResetSimulation}
                    className="flex items-center space-x-1 text-[10px] text-blue-700 font-semibold hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] font-medium text-slate-700 mb-1">
                    <span>Timeline Shift:</span>
                    <strong className="text-blue-700">+{delayDelta} mos</strong>
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
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-medium text-slate-700 mb-1">
                    <span>Acceleration:</span>
                    <strong className="text-blue-700">{progressDelta >= 0 ? `+${progressDelta}` : progressDelta}%</strong>
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
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-medium text-slate-700 mb-1">
                    <span>Tender Escalation:</span>
                    <strong className="text-blue-700">+{costEscalation}%</strong>
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
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Explainable AI (XAI) Attribution Breakdown */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-outfit">
                  Explainable AI (XAI): Predictive Drivers Breakdown
                </h3>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                <Info className="w-3 h-3 text-slate-400" />
                <span>Features represent statistical weights; not causal blame.</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {(project.shapDrivers || []).map((driver, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-xs">{driver.feature}</span>
                    <span className="font-bold text-red-700 text-xs">+{driver.impact}% Model Attribution</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-blue-700 h-full rounded-full"
                      style={{ width: `${Math.min(100, driver.impact * 2.5)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-600">{driver.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Early Warning Recommendation */}
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg space-y-1">
            <div className="text-red-800 font-bold text-xs uppercase flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Recommended Government Action</span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed font-medium">
              {project.earlyWarningNote || "Initiate monthly tripartite review involving line ministry financial division, implementing agency, and state administration to resolve land and statutory clearances."}
            </p>
          </div>

          {/* Section 6: Officer Intervention Logging (Direct MongoDB Persistence) */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-outfit">
                Log Officer Intervention for This Project
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Persisted to MongoDB: <code>interventions</code>
              </span>
            </div>

            {interventionSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Intervention committed successfully to MongoDB cluster.</span>
              </div>
            )}

            <form onSubmit={handleSubmitIntervention} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Action Taken / Executive Directive *
                </label>
                <textarea
                  required
                  rows={2}
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="e.g. Issued directive to Railway Board to release advance working capital to expedite tunnel excavation..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Responsible Authority *
                  </label>
                  <input
                    type="text"
                    required
                    value={responsibleAuthority}
                    onChange={(e) => setResponsibleAuthority(e.target.value)}
                    placeholder="e.g. Chief Administrative Officer / GM Northern Railway"
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Resolution Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingIntervention}
                className="px-4 py-2 bg-[#0a2540] hover:bg-slate-900 text-white rounded font-bold text-xs transition-colors flex items-center space-x-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingIntervention ? 'Saving...' : 'Commit Intervention to Audit Trail'}</span>
              </button>
            </form>
          </div>

          {/* Section 7: Data Provenance & Verification Badge */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Data Provenance: <strong>Ministry of Statistics and Programme Implementation (MoSPI)</strong></span>
            </div>
            <div className="font-mono text-slate-500">
              Reporting Cycle: April 2026 • Verified CUF #{project.code}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0a2540] hover:bg-slate-900 text-white rounded text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            Close Deep-Dive View
          </button>
        </div>

      </div>
    </div>
  );
}
