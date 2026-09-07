import React from 'react';
import { FileText, Sparkles, Calendar } from 'lucide-react';

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
      isNew: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              Official MoSPI Project Monitoring Reports & Publications
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            Official monthly flash and review reports published by the Infrastructure & Project Monitoring Division (IPMD). The PAIMANA-AI layer extracts key CUF variables and predicts future cost/time trajectory.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div 
            key={rep.id} 
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500">DOC-REF #{rep.id}</span>
                {rep.isNew && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 rounded uppercase">
                    New Publication
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-outfit mb-1">{rep.title}</h3>
              <p className="text-[11px] text-slate-500 mb-3 font-medium">{rep.type}</p>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
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
                  <span className="font-bold text-red-600">{rep.costOverrunProjects} projects</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Published: {rep.date}</span>
              </span>

              <button
                onClick={() => onAskAIAboutReport(rep.title)}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Deep-Dive Insights</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
