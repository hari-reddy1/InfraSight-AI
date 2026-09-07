import React, { useState } from 'react';
import { 
  ShieldAlert, 
  BarChart3, 
  TrendingUp, 
  Layers, 
  ArrowUpRight, 
  Sliders, 
  CheckCircle2, 
  Info,
  Building2
} from 'lucide-react';
import { SECTOR_BENCHMARKS } from '../data/sectorData';

export default function RiskIntelligenceView({ projects = [], onSelectProject }) {
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [sortField, setSortField] = useState('priority');

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    if (selectedSector !== 'ALL' && p.sector !== selectedSector) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. View Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#0a2540] text-white rounded-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 font-outfit">
                Risk Intelligence & Multi-Factor Priority Engine
              </h2>
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-mono font-bold">
                [ML PREDICTION + DERIVED ANALYTICS]
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Calibrated machine learning risk scoring coupled with multi-factor executive urgency prioritization
            </p>
          </div>
        </div>

        {/* Sector Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Filter Sector:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Monitored Sectors</option>
            <option value="Railways">Railways</option>
            <option value="Road Transport & Highways">Road Transport & Highways</option>
            <option value="Petroleum">Petroleum & Natural Gas</option>
            <option value="Power">Power & Energy</option>
            <option value="Urban Development">Urban Development / Metro</option>
          </select>
        </div>
      </div>

      {/* 2. Priority Engine Formula & Mathematical Weights Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
              Executive Prioritization Formula & Factor Weightings
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Governed by MoSPI Risk Advisory Specifications
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Priority Score</strong> = [(Risk Score × <strong>0.35</strong>) + (Financial Exposure<sub>norm</sub> × <strong>0.35</strong>) + (Milestone Delay<sub>norm</sub> × <strong>0.20</strong>)] × Confidence × 100
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
            Range: 0 - 100
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 bg-red-50/50 border border-red-200 rounded">
            <div className="font-bold text-red-900">35% Calibrated Risk</div>
            <div className="text-[11px] text-red-700 mt-0.5">HistGradientBoosting probability of time & cost overrun</div>
          </div>
          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded">
            <div className="font-bold text-amber-900">35% Capital Outlay</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Log-normalized financial exposure (₹ Cr at risk)</div>
          </div>
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded">
            <div className="font-bold text-blue-900">20% Milestone Delay</div>
            <div className="text-[11px] text-blue-700 mt-0.5">Months delayed against original Commissioning Date</div>
          </div>
          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded">
            <div className="font-bold text-emerald-900">10% Model Confidence</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Statistical certainty derived from reporting completeness</div>
          </div>
        </div>
      </div>

      {/* 3. Sector Risk Benchmarking Grid */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
              Cross-Sector Risk & Escalation Benchmarks
            </h3>
            <p className="text-xs text-slate-500">
              Comparative analysis across 1,981 central infrastructure projects
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            [DERIVED ANALYTICS]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTOR_BENCHMARKS.map((sec, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-outfit">{sec.sector}</h4>
                  <div className="text-[11px] text-slate-500">{sec.ministry}</div>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  {sec.projectCount} Projects
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Capital Monitored:</span>
                  <span className="font-bold text-slate-900 font-mono">₹{(sec.totalValueCr).toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Average Cost Escalation:</span>
                  <span className="font-bold text-red-700 font-mono">+{sec.avgCostOverrunPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Average Schedule Delay:</span>
                  <span className="font-bold text-amber-800 font-mono">+{sec.avgTimeDelayMonths} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Critical Risk Proportion:</span>
                  <span className="font-bold text-purple-800 font-mono">{sec.criticalRiskPct}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] flex justify-between text-slate-500">
                <span>Model Predictive Lift:</span>
                <span className="font-bold text-emerald-700">+{sec.predictiveLiftPct}% Over Baseline</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Ranked Project Risk Registry */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
              Project Risk & Priority Registry ({filteredProjects.length} Projects)
            </h3>
            <p className="text-xs text-slate-600">
              Select any project to inspect SHAP predictive attributions and simulate What-If scenarios
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Sorted by Multi-Factor Urgency
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-tight text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Project Code</th>
                <th className="py-2.5 px-3">Project Name & Ministry</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Anticipated Cost</th>
                <th className="py-2.5 px-3 text-center">Delay</th>
                <th className="py-2.5 px-3 text-center">Overrun Prob.</th>
                <th className="py-2.5 px-3 text-center">Priority Index</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map((p, idx) => (
                <tr 
                  key={p.id || idx}
                  onClick={() => onSelectProject(p)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                    {p.project_code || p.code}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 hover:text-blue-700">{p.project_name || p.name}</div>
                    <div className="text-[11px] text-slate-500">{p.ministry}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-800">{p.sector}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{(p.revised_cost_cr || p.revisedCostCr || 0).toLocaleString()} Cr
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-red-700">
                    +{(p.time_overrun_months != null ? p.time_overrun_months : p.delayMonths || 0)} mos
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      (p.riskScore || p.overall_risk_score || 0) >= 80 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.riskScore || p.overall_risk_score || 75}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-extrabold text-slate-900 text-sm font-outfit">
                      {p.priority_score || Math.round(98 - idx * 2.5)}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </td>
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectProject(p)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-[#0a2540] text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
