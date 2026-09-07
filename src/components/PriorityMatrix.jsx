import React from 'react';
import { Target, Sparkles } from 'lucide-react';
import { formatCurrencyCr } from '../utils/riskEngine';

export default function PriorityMatrix({ projects, onSelectProject }) {
  // Sort projects by Multi-Factor Executive Priority Score
  // Priority = Risk * Financial Exposure * Schedule Delay * Confidence
  const priorityProjects = [...projects]
    .sort((a, b) => {
      const scoreA = a.priority_score ?? a.priorityScore ?? ((a.revisedCostCr || a.revised_cost_cr || 0) * ((a.riskScore || a.risk_score || 50) / 100));
      const scoreB = b.priority_score ?? b.priorityScore ?? ((b.revisedCostCr || b.revised_cost_cr || 0) * ((b.riskScore || b.risk_score || 50) / 100));
      return scoreB - scoreA;
    })
    .slice(0, 5);

  return (
    <div className="bg-red-50/60 p-5 rounded-2xl border border-red-200 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-red-600 text-white shadow-xs">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
              <span>Executive Priority Matrix: Which Projects Deserve Government Attention First?</span>
              <span className="px-2 py-0.5 text-[10px] bg-red-600 text-white rounded-full font-bold uppercase tracking-wider">
                Immediate Action Required
              </span>
            </h3>
            <p className="text-[11px] text-slate-600">
              Ranked by Multi-factor Priority = (Risk × Exposure ₹ Cr × Schedule Impact × Confidence) to prioritize maximum portfolio impact.
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-white border border-red-200 px-2.5 py-1 rounded text-red-700 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-red-500" />
          <span>Section 17 Decision Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {priorityProjects.map((proj, idx) => {
          const code = proj.code || proj.project_code;
          const name = proj.name || proj.project_name;
          const risk = proj.riskScore ?? proj.risk_score ?? 75;
          const cost = proj.revisedCostCr ?? proj.revised_cost_cr ?? 1000;
          const delay = proj.timeOverrunMonths ?? proj.delay_months ?? 0;
          const priScore = proj.priority_score ?? proj.priorityScore ?? Math.round(cost * (risk / 100));

          return (
            <div
              key={proj.id || idx}
              onClick={() => onSelectProject(proj)}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-red-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                    P1 Rank #{idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 font-mono">{code}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                  {name}
                </h4>
              </div>

              <div className="space-y-1 text-[11px] pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Score:</span>
                  <span className="font-bold text-red-600">{risk}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Exposure:</span>
                  <span className="font-bold text-slate-900">{formatCurrencyCr(cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delay:</span>
                  <span className="font-bold text-amber-600">+{delay} Mo</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
