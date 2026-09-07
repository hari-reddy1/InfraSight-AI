import React from 'react';
import { Target } from 'lucide-react';
import { formatCurrencyCr } from '../utils/riskEngine';

export default function PriorityMatrix({ projects, onSelectProject }) {
  // Sort projects by Exposure Score (Revised Cost * Risk Score %)
  const priorityProjects = [...projects]
    .sort((a, b) => b.exposureScoreCr - a.exposureScoreCr)
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
              <span>Executive Priority Matrix: What Should Government Look at First?</span>
              <span className="px-2 py-0.5 text-[10px] bg-red-600 text-white rounded-full font-bold uppercase tracking-wider">
                Immediate Action Required
              </span>
            </h3>
            <p className="text-[11px] text-slate-600">
              Ranked by Risk Severity × Capital Exposure (₹ Cr) to prioritize maximum portfolio impact.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {priorityProjects.map((proj, idx) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject(proj)}
            className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-red-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                  Priority #{idx + 1}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">{proj.code}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                {proj.name}
              </h4>
            </div>

            <div className="space-y-1 text-[11px] pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score:</span>
                <span className="font-bold text-red-600">{proj.riskScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Capital Value:</span>
                <span className="font-bold text-slate-900">{formatCurrencyCr(proj.revisedCostCr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Overrun:</span>
                <span className="font-bold text-amber-600">+{proj.timeOverrunMonths} Mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
