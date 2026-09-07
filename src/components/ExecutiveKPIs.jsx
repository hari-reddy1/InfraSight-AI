import React from 'react';
import { Zap } from 'lucide-react';
import { PORTFOLIO_SUMMARY } from '../data/sampleProjects';

export default function ExecutiveKPIs({ onSelectFilter }) {
  return (
    <div className="space-y-3">
      {/* Sub-Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <Zap className="w-4 h-4 text-orange-600" />
          <span className="font-bold text-slate-900">AI Portfolio Risk Distribution</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">1,981 Ongoing Central Sector Projects (₹42.78 Lakh Cr Monitored)</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
          Predictive Intelligence Layer on top of PAIMANA / OCMS Data
        </div>
      </div>

      {/* 4-Tier Risk Distribution Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Critical */}
        <div
          onClick={() => onSelectFilter('Critical')}
          className="bg-white p-4 rounded-xl border-2 border-red-200 hover:border-red-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              🔴 Critical Risk
            </span>
            <span className="text-[11px] text-slate-400 font-mono font-semibold">(&gt;90%)</span>
          </div>
          <div className="text-3xl font-extrabold font-outfit text-slate-900 group-hover:text-red-700 transition-colors">
            {PORTFOLIO_SUMMARY.criticalRiskCount} <span className="text-xs font-semibold text-slate-500">projects</span>
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1">High Overrun & Delay Imminent</div>
        </div>

        {/* High */}
        <div
          onClick={() => onSelectFilter('High')}
          className="bg-white p-4 rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              🟠 High Risk
            </span>
            <span className="text-[11px] text-slate-400 font-mono font-semibold">(70-90%)</span>
          </div>
          <div className="text-3xl font-extrabold font-outfit text-slate-900 group-hover:text-amber-700 transition-colors">
            {PORTFOLIO_SUMMARY.highRiskCount} <span className="text-xs font-semibold text-slate-500">projects</span>
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Early Divergence Flagged</div>
        </div>

        {/* Medium */}
        <div
          onClick={() => onSelectFilter('Medium')}
          className="bg-white p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              🟡 Medium Risk
            </span>
            <span className="text-[11px] text-slate-400 font-mono font-semibold">(45-70%)</span>
          </div>
          <div className="text-3xl font-extrabold font-outfit text-slate-900 group-hover:text-purple-700 transition-colors">
            {PORTFOLIO_SUMMARY.mediumRiskCount} <span className="text-xs font-semibold text-slate-500">projects</span>
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">Moderate Schedule Slippage</div>
        </div>

        {/* Low */}
        <div
          onClick={() => onSelectFilter('Low')}
          className="bg-white p-4 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              🟢 Low Risk
            </span>
            <span className="text-[11px] text-slate-400 font-mono font-semibold">(&lt;45%)</span>
          </div>
          <div className="text-3xl font-extrabold font-outfit text-slate-900 group-hover:text-emerald-700 transition-colors">
            {PORTFOLIO_SUMMARY.lowRiskCount.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">projects</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">On Track for Completion</div>
        </div>
      </div>
    </div>
  );
}
