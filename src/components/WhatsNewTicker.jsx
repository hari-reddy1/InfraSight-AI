import React from 'react';
import { Bell } from 'lucide-react';

export default function WhatsNewTicker({ onOpenReport }) {
  const newsItems = [
    { tag: "NEW", title: "Monthly Flash Report March 2026 Published by IPMD", type: "report" },
    { tag: "AI ALERT", title: "Early Warning: 87 Central Sector Projects Breached Overrun Thresholds", type: "alert" },
    { tag: "UPDATE", title: "April 2026 CUF Monthly Monitoring Cycle Ingestion Active", type: "info" },
    { tag: "REVIEW", title: "Monthly Review Report January 2026 Available for 17+ Ministries", type: "report" },
    { tag: "BENCHMARK", title: "Predictive Intelligence Layer: +34.2% Accuracy Gain over CUF Fields", type: "ai" }
  ];

  return (
    <div className="bg-[#fff7ed] border-y border-orange-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        
        {/* Badge Label */}
        <div className="flex items-center space-x-1.5 shrink-0 bg-orange-600 text-white px-2.5 py-0.5 rounded font-bold text-[11px] uppercase tracking-wider shadow-2xs">
          <Bell className="w-3 h-3 text-white animate-bounce" />
          <span>What’s New</span>
        </div>

        {/* Ticker Content */}
        <div className="ticker-wrap flex-1 overflow-hidden">
          <div className="ticker-move flex items-center space-x-8 text-slate-800 font-medium">
            {newsItems.concat(newsItems).map((item, idx) => (
              <div 
                key={idx} 
                className="inline-flex items-center space-x-2 shrink-0 cursor-pointer hover:text-orange-700 transition-colors"
                onClick={() => onOpenReport && onOpenReport(item)}
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.type === 'alert' ? 'bg-red-100 text-red-700 border border-red-300' :
                  item.type === 'ai' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' :
                  'bg-orange-100 text-orange-800 border border-orange-300'
                }`}>
                  {item.tag}
                </span>
                <span className="text-[11px]">{item.title}</span>
                <span className="text-slate-400">•</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
