import React, { useState } from 'react';
import { 
  Building2, 
  Filter, 
  ArrowUpDown, 
  Sparkles
} from 'lucide-react';
import { formatCurrencyCr } from '../utils/riskEngine';

export default function ProjectTable({ projects, onSelectProject, filterRisk, setFilterRisk }) {
  const [selectedMinistry, setSelectedMinistry] = useState('All');
  const [sortField, setSortField] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState('desc');

  const ministries = ['All', ...new Set(projects.map(p => p.ministry))];

  // Filtering
  const filteredProjects = projects.filter(proj => {
    const matchesRisk = filterRisk === 'all' || proj.riskLevel === filterRisk;
    const matchesMinistry = selectedMinistry === 'All' || proj.ministry === selectedMinistry;
    return matchesRisk && matchesMinistry;
  });

  // Sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getRiskStyle = (level) => {
    if (level === 'Critical') return 'bg-red-100 text-red-800 border-red-200';
    if (level === 'High') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (level === 'Medium') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-orange-600" />
          <h3 className="text-base font-bold text-slate-900 font-outfit">
            Central Sector Projects Directory
          </h3>
          <span className="px-2.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-semibold">
            {sortedProjects.length} Projects
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Level Filter Buttons */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-300 shadow-2xs">
            {['all', 'Critical', 'High', 'Medium', 'Low'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterRisk(level)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  filterRisk === level
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {level === 'all' ? 'All Risks' : level}
              </button>
            ))}
          </div>

          {/* Ministry Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
            >
              {ministries.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Ministries' : m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Project Name & Code</th>
              <th className="py-3 px-4">Ministry / State</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-orange-700 transition-colors"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Cost Escalation (Sanctioned → Predicted)</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-orange-700 transition-colors"
                onClick={() => handleSort('timeOverrunMonths')}
              >
                <div className="flex items-center space-x-1">
                  <span>Est. Delay</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Physical Progress</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedProjects.map((proj) => (
              <tr 
                key={proj.id}
                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onSelectProject(proj)}
              >
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {proj.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                    <span>{proj.code}</span>
                    <span>•</span>
                    <span>{proj.implementingAgency}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="font-medium">{proj.ministry}</div>
                  <div className="text-[11px] text-slate-500">{proj.state}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskStyle(proj.riskLevel)}`}>
                    {proj.riskScore}% ({proj.riskLevel})
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">
                    {formatCurrencyCr(proj.approvedCostCr)} → <span className="text-red-600 font-bold">{formatCurrencyCr(proj.predictedCostOverrunCr)}</span>
                  </div>
                  <div className="text-[11px] text-red-600 font-semibold">
                    +{proj.costOverrunPct}% overrun
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-amber-700">
                    +{proj.timeOverrunMonths} Months
                  </div>
                  <div className="text-[11px] text-slate-500">
                    DOC: {proj.predictedDOC}
                  </div>
                </td>
                <td className="py-3.5 px-4 w-36">
                  <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium mb-1">
                    <span>{proj.physicalProgressPct}%</span>
                    <span className="text-slate-500">Fin: {proj.financialProgressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-orange-600 h-full rounded-full" 
                      style={{ width: `${proj.physicalProgressPct}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(proj);
                    }}
                    className="px-3 py-1.5 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ml-auto shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>XAI Drivers</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
