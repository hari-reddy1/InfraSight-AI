import React, { useState } from 'react';
import { 
  Building2, 
  Filter, 
  ArrowUpDown, 
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatCurrencyCr } from '../utils/riskEngine';

export default function ProjectTable({ 
  projects = [], 
  onSelectProject, 
  filterRisk, 
  setFilterRisk 
}) {
  const [selectedMinistry, setSelectedMinistry] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const ministries = ['All', ...new Set(projects.map(p => p.ministry).filter(Boolean))];
  const sectors = ['All', ...new Set(projects.map(p => p.sector).filter(Boolean))];

  // Filtering
  const filteredProjects = projects.filter(proj => {
    const matchesRisk = filterRisk === 'all' || proj.riskLevel === filterRisk;
    const matchesMinistry = selectedMinistry === 'All' || proj.ministry === selectedMinistry;
    const matchesSector = selectedSector === 'All' || proj.sector === selectedSector;
    const matchesSearch = !searchTerm || 
      (proj.name && proj.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proj.code && proj.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proj.state && proj.state.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRisk && matchesMinistry && matchesSector && matchesSearch;
  });

  // Sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (valA == null) valA = 0;
    if (valB == null) valB = 0;
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1;
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getRiskStyle = (level) => {
    if (level === 'Critical' || level === 'CRITICAL') return 'bg-red-50 text-red-700 border-red-200 font-bold';
    if (level === 'High' || level === 'HIGH') return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
    if (level === 'Medium' || level === 'MODERATE') return 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden space-y-4">
      
      {/* 1. Header with Controls & Filters */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
                Central Sector Projects Directory
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                [OFFICIAL SOURCE: MoSPI Central Sector Ingestion]
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Showing {filteredProjects.length} of {projects.length} verified projects costing &ge; ₹150 Crore
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by code, name, state..."
              className="w-full bg-white border border-slate-300 rounded text-xs pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Risk Level Filter Buttons */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded border border-slate-300">
            {['all', 'Critical', 'High', 'Medium', 'Low'].map((level) => (
              <button
                key={level}
                onClick={() => {
                  setFilterRisk(level);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  filterRisk === level
                    ? 'bg-[#0a2540] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {level === 'all' ? 'All Risks' : level}
              </button>
            ))}
          </div>

          {/* Ministry & Sector Dropdowns */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedMinistry}
              onChange={(e) => {
                setSelectedMinistry(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {ministries.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Ministries' : m}
                </option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 text-xs text-slate-800 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Sectors' : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Project Code & Name</th>
              <th className="py-2.5 px-3">Ministry / Sector / State</th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-blue-900 transition-colors"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>Overrun Prob.</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">Sanctioned → Anticipated</th>
              <th 
                className="py-2.5 px-3 text-center cursor-pointer hover:text-blue-900 transition-colors"
                onClick={() => handleSort('timeOverrunMonths')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Est. Delay</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">Progress Trajectory</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedProjects.map((proj) => (
              <tr 
                key={proj.id}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => onSelectProject(proj)}
              >
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900 hover:text-blue-700 transition-colors">
                    {proj.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                    <span>{proj.code}</span>
                    <span>•</span>
                    <span>{proj.implementingAgency}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-700">
                  <div className="font-medium text-slate-800">{proj.ministry}</div>
                  <div className="text-[11px] text-slate-500">{proj.sector} • {proj.state}</div>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${getRiskStyle(proj.riskLevel)}`}>
                    {proj.riskScore}% ({proj.riskLevel})
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="font-mono text-slate-700">
                    ₹{(proj.approvedCostCr || 0).toLocaleString()} Cr → <span className="font-bold text-slate-900">₹{(proj.revisedCostCr || proj.predictedCostOverrunCr || 0).toLocaleString()} Cr</span>
                  </div>
                  <div className="text-[11px] text-red-700 font-medium">
                    +{proj.costOverrunPct || 0}% Escalation
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="font-mono font-bold text-red-700">
                    +{proj.timeOverrunMonths || 0} mos
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    DOC: {proj.predictedDOC || "2026-12"}
                  </div>
                </td>
                <td className="py-3 px-3 w-40">
                  <div className="flex items-center justify-between text-[11px] text-slate-700 mb-1">
                    <span>Phy: <strong>{proj.physicalProgressPct}%</strong></span>
                    <span className="text-slate-500">Fin: {proj.financialProgressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-700 h-full rounded-full" 
                      style={{ width: `${proj.physicalProgressPct}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="px-2.5 py-1 bg-[#0a2540] hover:bg-slate-800 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Deep Dive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Controls */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredProjects.length} total filtered projects)
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono font-bold text-slate-800">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
