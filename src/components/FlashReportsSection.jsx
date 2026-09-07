import React from 'react';
import { FileText, Sparkles, Calendar, ExternalLink, ShieldCheck, Download, BookOpen } from 'lucide-react';

export default function FlashReportsSection({ onAskAIAboutReport }) {
  const reports = [
    {
      id: 31,
      title: "Monthly Flash Report — March 2026",
      type: "Project Monitoring Report (April 2026 Release)",
      coverage: "1,981 Projects (₹150 Cr and above)",
      delayedProjects: 432,
      costOverrunProjects: 389,
      totalCostCr: "₹42.78 Lakh Cr",
      date: "March 2026",
      officialUrl: "https://paimana-proj.mospi.gov.in/ReportPage",
      isNew: true
    },
    {
      id: 29,
      title: "Monthly Review Report — January 2026",
      type: "Performance Monitoring Division",
      coverage: "17+ Line Ministries & Implementing Agencies",
      delayedProjects: 418,
      costOverrunProjects: 375,
      totalCostCr: "₹41.95 Lakh Cr",
      date: "January 2026",
      officialUrl: "https://paimana-proj.mospi.gov.in/ProjectMonitoring",
      isNew: true
    },
    {
      id: 30,
      title: "Monthly Flash Report — February 2026",
      type: "Project Monitoring Division",
      coverage: "1,954 Projects Monitored",
      delayedProjects: 425,
      costOverrunProjects: 381,
      totalCostCr: "₹42.10 Lakh Cr",
      date: "February 2026",
      officialUrl: "https://paimana-proj.mospi.gov.in/ReportPage",
      isNew: false
    },
    {
      id: 28,
      title: "Monthly Flash Report — January 2026",
      type: "Project Monitoring Division",
      coverage: "1,940 Projects Monitored",
      delayedProjects: 410,
      costOverrunProjects: 369,
      totalCostCr: "₹41.80 Lakh Cr",
      date: "January 2026",
      officialUrl: "https://paimana-proj.mospi.gov.in/ReportPage/ArchiveProjectMonitoring",
      isNew: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Official Banner & Alignment */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-slate-900 font-outfit">
              Official MoSPI Project Monitoring Reports & Publications
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
              [OFFICIAL SOURCE: MoSPI IPMD]
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            Official monthly flash and review reports published by the Infrastructure & Project Monitoring Division (IPMD). 
            InfraSight AI provides the analytical and predictive intelligence layer operating in synchronization with the Government of India's 
            official <a href="https://paimana-proj.mospi.gov.in/ReportPage" target="_blank" rel="noreferrer" className="text-blue-700 underline font-semibold inline-flex items-center gap-0.5">PAIMANA Report Page <ExternalLink className="w-2.5 h-2.5" /></a>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="https://paimana-proj.mospi.gov.in/ReportPage"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-[#0a2540] hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Official PAIMANA Portal</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Official Government Publication Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a 
          href="https://paimana-proj.mospi.gov.in/ReportPage"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 font-outfit group-hover:text-blue-700">Project Monitoring</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700" />
          </div>
          <p className="text-[11px] text-slate-500">
            Monthly project implementation status across Central Sector projects costing ₹150 Cr and above.
          </p>
          <div className="text-[10px] text-blue-700 font-semibold mt-2">paimana-proj.mospi.gov.in/ReportPage &rarr;</div>
        </a>

        <a 
          href="https://paimana-proj.mospi.gov.in/ProjectMonitoring"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 font-outfit group-hover:text-blue-700">Performance Monitoring</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700" />
          </div>
          <p className="text-[11px] text-slate-500">
            Sector-wide and ministry-specific milestone compliance and physical velocity tracking.
          </p>
          <div className="text-[10px] text-blue-700 font-semibold mt-2">paimana-proj.mospi.gov.in/ProjectMonitoring &rarr;</div>
        </a>

        <a 
          href="https://paimana-proj.mospi.gov.in/ReportPage/ArchiveProjectMonitoring"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 font-outfit group-hover:text-blue-700">Archive Project Monitoring</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700" />
          </div>
          <p className="text-[11px] text-slate-500">
            Historical archives of flash reports and multi-year project commissioning records.
          </p>
          <div className="text-[10px] text-blue-700 font-semibold mt-2">paimana-proj.mospi.gov.in/ReportPage/Archive... &rarr;</div>
        </a>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div 
            key={rep.id} 
            className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500">DOC-REF #{rep.id}</span>
                {rep.isNew && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded uppercase">
                    New Publication
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-outfit mb-1">{rep.title}</h3>
              <p className="text-[11px] text-slate-500 mb-3 font-medium">{rep.type}</p>

              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Total Sanctioned Value:</span>
                  <span className="font-bold text-slate-900">{rep.totalCostCr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Projects Monitored:</span>
                  <span className="font-bold text-slate-800">{rep.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Reported Schedule Delays:</span>
                  <span className="font-bold text-amber-700">{rep.delayedProjects} projects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Reported Cost Escalations:</span>
                  <span className="font-bold text-red-700">{rep.costOverrunProjects} projects</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Published: {rep.date}</span>
              </span>

              <div className="flex items-center space-x-2">
                <a
                  href={rep.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>MoSPI Source</span>
                </a>

                {onAskAIAboutReport && (
                  <button
                    onClick={() => onAskAIAboutReport(rep.title)}
                    className="px-3 py-1 bg-[#0a2540] hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Risk Analytics</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
