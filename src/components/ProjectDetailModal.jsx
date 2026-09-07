import React from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert
} from 'lucide-react';
import { formatCurrencyCr } from '../utils/riskEngine';

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  const getRiskStyle = (level) => {
    if (level === 'Critical') return 'bg-red-100 text-red-800 border-red-200';
    if (level === 'High') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (level === 'Medium') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-mono px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded font-bold">
                {project.code}
              </span>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getRiskStyle(project.riskLevel)}`}>
                AI Risk Score: {project.riskScore}% ({project.riskLevel})
              </span>
              <span className="text-xs text-slate-600 font-medium">• {project.ministry}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              {project.name}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Agency: <span className="text-slate-900 font-semibold">{project.implementingAgency}</span> ({project.state})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Question 5: What Might Happen Next? (Predictive Forecast Grid) */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5 font-outfit">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI Predictive Forecast: What Might Happen Next?</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cost Forecast */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 shadow-2xs">
                <div className="text-slate-500 font-bold text-[11px] uppercase">Cost Forecast</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Current Sanctioned:</span>
                  <span className="font-bold text-slate-900">{formatCurrencyCr(project.revisedCostCr)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Predicted Final Cost:</span>
                  <span className="font-bold text-red-600">{formatCurrencyCr(project.predictedCostOverrunCr)}</span>
                </div>
                <div className="p-2.5 bg-red-50 rounded border border-red-200 flex justify-between text-[11px]">
                  <span className="text-red-800 font-semibold">Expected Additional Cost:</span>
                  <span className="font-bold text-red-700">+{formatCurrencyCr(project.predictedCostOverrunCr - project.revisedCostCr)}</span>
                </div>
              </div>

              {/* Time Forecast */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 shadow-2xs">
                <div className="text-slate-500 font-bold text-[11px] uppercase">Timeline Forecast</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Expected DOC (Official):</span>
                  <span className="font-bold text-slate-900">{project.revisedDOC}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Predicted DOC (AI):</span>
                  <span className="font-bold text-amber-700">{project.predictedDOC}</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 flex justify-between text-[11px]">
                  <span className="text-amber-800 font-semibold">Expected Delay:</span>
                  <span className="font-bold text-amber-700">+{project.timeOverrunMonths} Months</span>
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

          {/* Question 3: Why is the project risky? (Explainable AI SHAP Breakdown) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900 font-outfit">
                  Explainable AI (XAI): Why is this Project Risky?
                </h3>
              </div>
              <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold border border-slate-200">
                SHAP Feature Attribution
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {project.shapDrivers.map((driver, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{driver.feature}</span>
                    <span className="font-bold text-red-600">+{driver.impact}% Risk Contribution</span>
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

          {/* Early Warning Recommendation */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
            <div className="text-red-700 font-bold text-xs uppercase flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Early Warning & Decision Support Recommendation</span>
            </div>
            <p className="text-xs text-red-900 font-medium">{project.earlyWarningNote}</p>
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
