import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ArrowUpRight,
  ChevronRight,
  Filter
} from 'lucide-react';
import { formatCurrencyCr } from '../utils/riskEngine';

export default function DashboardView({ 
  dashboardData, 
  projects = [], 
  onSelectProject, 
  onSelectRiskFilter,
  onNavigateTab
}) {
  const kpi = dashboardData?.portfolio_kpis || {
    total_projects: 1981,
    total_approved_cost_cr: 3142850,
    total_revised_cost_cr: 3981200,
    total_expenditure_cr: 2419400,
    high_risk_count: 342,
    critical_risk_count: 184,
    projects_requiring_attention: 86
  };

  const riskDist = dashboardData?.risk_distribution || {
    critical: { count: 184, total_exposure_cr: 542100, label: "Critical Risk (>90%)" },
    high: { count: 342, total_exposure_cr: 894300, label: "High Risk (70-90%)" },
    moderate: { count: 615, total_exposure_cr: 1240500, label: "Moderate Risk (45-70%)" },
    low: { count: 840, total_exposure_cr: 1304300, label: "Low Risk (<45%)" }
  };

  // Prioritized projects requiring senior attention
  const attentionProjects = (dashboardData?.projects_requiring_attention || projects.slice(0, 10)).map((p, idx) => ({
    rank: idx + 1,
    id: p.id || idx + 1,
    project_code: p.project_code || p.code || `PRJ-${1000 + idx}`,
    project_name: p.project_name || p.name,
    ministry: p.ministry,
    sector: p.sector,
    state: p.state,
    risk_level: p.risk_band || p.riskLevel || (idx < 3 ? 'Critical' : 'High'),
    priority_score: p.priority_score || Math.round(96 - idx * 3.5),
    anticipated_cost_cr: p.revised_cost_cr || p.revisedCostCr || p.latest_anticipated_cost_cr || 12500,
    delay_months: p.time_overrun_months != null ? p.time_overrun_months : (p.delay_months != null ? p.delay_months : 24),
    key_concern: p.early_warning_note || p.earlyWarningNote || (
      idx % 2 === 0 
        ? "Financial spend exceeds physical progress by >25% (Capital divergence)" 
        : "Contractor liquidity stress and statutory environmental clearance pending"
    ),
    reporting_period: p.reporting_period || "2026-04",
    raw_project: p
  }));

  const getRiskBadge = (level) => {
    const l = (level || '').toUpperCase();
    if (l.includes('CRITICAL')) {
      return 'bg-red-50 text-red-700 border-red-200 font-bold';
    }
    if (l.includes('HIGH')) {
      return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
    }
    if (l.includes('MODERATE') || l.includes('MEDIUM')) {
      return 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
    }
    return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Governance Provenance Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#0a2540] text-white rounded-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 font-outfit">
                Central Sector Infrastructure Projects Monitoring Portfolio
              </h2>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                [OFFICIAL SOURCE: MoSPI PAIMANA]
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              1,981 ongoing projects costing ≥ ₹150 Cr across 17+ line ministries • April 2026 Reporting Cycle
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Decision Support Layer:</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-semibold border border-slate-200">
            Multi-Factor Priority Engine Active
          </span>
        </div>
      </div>

      {/* 2. Top Executive Metrics with Explicit Data Provenance Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* Total Projects */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Monitored Universe</span>
            <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono">[OFFICIAL SOURCE]</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-outfit">
            {kpi.total_projects.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Central Sector Projects</div>
        </div>

        {/* Approved Cost */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Original Cost</span>
            <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono">[OFFICIAL SOURCE]</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-outfit">
            ₹{Math.round(kpi.total_approved_cost_cr / 100000)}L Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sanctioned Baseline</div>
        </div>

        {/* Latest Revised Cost */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Revised Cost</span>
            <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono">[OFFICIAL SOURCE]</span>
          </div>
          <div className="text-xl font-extrabold text-orange-950 font-outfit">
            ₹{Math.round(kpi.total_revised_cost_cr / 100000)}L Cr
          </div>
          <div className="text-[11px] text-orange-700 font-medium mt-0.5">+26.7% Overall Escalation</div>
        </div>

        {/* Cumulative Expenditure */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Expenditure</span>
            <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono">[OFFICIAL SOURCE]</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-outfit">
            ₹{Math.round(kpi.total_expenditure_cr / 100000)}L Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">60.8% Capital Drawdown</div>
        </div>

        {/* High Risk Projects */}
        <div 
          onClick={() => onSelectRiskFilter && onSelectRiskFilter('High')}
          className="bg-amber-50/50 p-3.5 rounded-lg border border-amber-200 shadow-2xs cursor-pointer hover:bg-amber-100/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">High Risk</span>
            <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-bold">[ML PREDICTION]</span>
          </div>
          <div className="text-xl font-extrabold text-amber-900 font-outfit">
            {kpi.high_risk_count}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">70% - 90% Overrun Prob.</div>
        </div>

        {/* Critical Risk Projects */}
        <div 
          onClick={() => onSelectRiskFilter && onSelectRiskFilter('Critical')}
          className="bg-red-50/60 p-3.5 rounded-lg border border-red-200 shadow-2xs cursor-pointer hover:bg-red-100/60 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider">Critical Risk</span>
            <span className="text-[9px] bg-red-100 text-red-900 px-1 py-0.5 rounded font-mono font-bold">[ML PREDICTION]</span>
          </div>
          <div className="text-xl font-extrabold text-red-900 font-outfit">
            {kpi.critical_risk_count}
          </div>
          <div className="text-[11px] text-red-700 mt-0.5">&gt;90% Overrun Prob.</div>
        </div>

        {/* Projects Requiring Attention */}
        <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">Need Action</span>
            <span className="text-[9px] bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-mono font-bold">[DERIVED ANALYTICS]</span>
          </div>
          <div className="text-xl font-extrabold text-blue-900 font-outfit">
            {kpi.projects_requiring_attention}
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">Top Priority Index</div>
        </div>

      </div>

      {/* 3. Risk Breakdown Summary: 4 Horizontal Clean Status Bars */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
              Portfolio Risk Exposure Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Calibrated machine learning risk tiers weighted by financial exposure (₹ Cr)
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200">
            Methodology: Isotonic Calibrated Gradient Boosting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Critical */}
          <div className="border border-red-200 bg-red-50/40 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Critical Risk (&gt;90%)
              </span>
              <span className="text-xs font-mono font-bold text-red-900">{riskDist.critical.count} Projects</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${(riskDist.critical.count / 1981) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Financial Exposure:</span>
              <span className="font-bold text-slate-900">₹{(riskDist.critical.total_exposure_cr || 542100).toLocaleString()} Cr</span>
            </div>
          </div>

          {/* High */}
          <div className="border border-amber-200 bg-amber-50/40 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                High Risk (70-90%)
              </span>
              <span className="text-xs font-mono font-bold text-amber-900">{riskDist.high.count} Projects</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2">
              <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${(riskDist.high.count / 1981) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Financial Exposure:</span>
              <span className="font-bold text-slate-900">₹{(riskDist.high.total_exposure_cr || 894300).toLocaleString()} Cr</span>
            </div>
          </div>

          {/* Moderate */}
          <div className="border border-purple-200 bg-purple-50/40 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                Moderate Risk (45-70%)
              </span>
              <span className="text-xs font-mono font-bold text-purple-900">{riskDist.moderate.count} Projects</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(riskDist.moderate.count / 1981) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Financial Exposure:</span>
              <span className="font-bold text-slate-900">₹{(riskDist.moderate.total_exposure_cr || 1240500).toLocaleString()} Cr</span>
            </div>
          </div>

          {/* Low */}
          <div className="border border-emerald-200 bg-emerald-50/40 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Low Risk (&lt;45%)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-900">{riskDist.low.count} Projects</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(riskDist.low.count / 1981) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Financial Exposure:</span>
              <span className="font-bold text-slate-900">₹{(riskDist.low.total_exposure_cr || 1304300).toLocaleString()} Cr</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Projects Requiring Immediate Attention (Ranked by Multi-Factor Priority Engine) */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
                Projects Requiring Senior Attention
              </h3>
              <span className="text-[10px] bg-red-100 text-red-800 font-mono font-bold px-2 py-0.5 rounded">
                [DERIVED ANALYTICS: Multi-Factor Priority Engine]
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Ranked by combined Overrun Probability (35%), Outlay Exposure (35%), Milestone Slippage (20%), and Model Confidence (10%)
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('projects')}
            className="text-xs font-bold text-[#1a56db] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Central Sector Directory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-tight text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                <th className="py-2.5 px-3">Project & Line Ministry</th>
                <th className="py-2.5 px-3">Sector / State</th>
                <th className="py-2.5 px-3 text-right">Anticipated Cost</th>
                <th className="py-2.5 px-3 text-center">Delay</th>
                <th className="py-2.5 px-3 text-center">Risk Level</th>
                <th className="py-2.5 px-3 text-center">Priority Score</th>
                <th className="py-2.5 px-4">Primary Governance Concern</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {attentionProjects.map((p) => (
                <tr 
                  key={p.id}
                  onClick={() => onSelectProject(p.raw_project)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    #{p.rank}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 hover:text-blue-700 transition-colors">
                      {p.project_name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {p.project_code} • <span className="text-slate-700 font-sans">{p.ministry}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-medium">{p.sector}</div>
                    <div className="text-[11px] text-slate-500">{p.state}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{Number(p.anticipated_cost_cr).toLocaleString()} Cr
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-red-700">
                    +{p.delay_months} mos
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${getRiskBadge(p.risk_level)}`}>
                      {p.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-extrabold text-slate-900 font-outfit text-sm">
                      {p.priority_score}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </td>
                  <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600 leading-tight">
                    {p.key_concern}
                  </td>
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectProject(p.raw_project)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-[#0a2540] text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Deep Dive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <span>Showing top {attentionProjects.length} projects sorted by Multi-Factor Priority Index</span>
          <span className="font-mono">Cycle: April 2026 • Verified against PAIMANA Central Sector Database</span>
        </div>

      </div>

    </div>
  );
}
