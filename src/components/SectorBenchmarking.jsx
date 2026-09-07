import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { SECTOR_BENCHMARKS } from '../data/sectorData';
import { formatCurrencyCr } from '../utils/riskEngine';

export default function SectorBenchmarking() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="p-1 rounded bg-orange-100 text-orange-700 font-bold text-xs">BENCHMARKING</span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              Sector Peer Benchmarking & Cost Escalation Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            Cross-ministry comparative analytics evaluating cost overruns, schedule slippage rates, and predictive accuracy gains across major Central Sector infrastructure verticals.
          </p>
        </div>
      </div>

      {/* Sector Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTOR_BENCHMARKS.map((sec, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-orange-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">{sec.sector}</span>
              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold border border-slate-200">
                {sec.projectCount} Projects
              </span>
            </div>
            
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Total Sanctioned Value:</span>
                <span className="font-bold text-slate-900 font-outfit">{formatCurrencyCr(sec.totalValueCr)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Avg Cost Overrun %:</span>
                <span className="font-bold text-red-600">+{sec.avgCostOverrunPct}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Avg Schedule Delay:</span>
                <span className="font-bold text-amber-700">{sec.avgTimeDelayMonths} Months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Critical Risk Proportion:</span>
                <span className="font-bold text-purple-700">{sec.criticalRiskPct}%</span>
              </div>
            </div>

            {/* CUF vs Extended Accuracy Bar */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Predictive Model Accuracy:</span>
                <span className="text-emerald-700 font-bold">{sec.cufModelAccuracyPct}% → {sec.extendedModelAccuracyPct}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 h-full rounded-full"
                  style={{ width: `${sec.extendedModelAccuracyPct}%` }}
                ></div>
              </div>
              <div className="text-right text-[10px] text-emerald-700 font-bold">
                Predictive Lift: {sec.predictiveLiftPct}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Sector Visual Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cost Overrun Comparison Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 font-outfit mb-3">
            Average Cost Overrun % by Sector
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECTOR_BENCHMARKS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="sector" type="category" stroke="#64748b" fontSize={10} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
                <Bar dataKey="avgCostOverrunPct" fill="#dc2626" radius={[0, 6, 6, 0]} name="Avg Cost Overrun %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Schedule Delay Comparison Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 font-outfit mb-3">
            Average Schedule Delay (Months) by Sector
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECTOR_BENCHMARKS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="sector" type="category" stroke="#64748b" fontSize={10} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a' }} />
                <Bar dataKey="avgTimeDelayMonths" fill="#ea580c" radius={[0, 6, 6, 0]} name="Avg Delay Months" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
