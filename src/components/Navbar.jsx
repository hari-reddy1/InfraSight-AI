import React from 'react';
import { Search } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm, 
  activeAlertsCount 
}) {
  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'risk_intelligence', label: 'Risk Intelligence' },
    { id: 'alerts', label: 'Alerts', badge: activeAlertsCount },
    { id: 'map', label: 'Geospatial Map' },
    { id: 'data_status', label: 'Data Status' },
    { id: 'model_performance', label: 'Model Performance' },
    { id: 'administration', label: 'Administration' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs">
      {/* Main Government & InfraSight AI Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Indian State Emblem + Ministry Bilingual Title */}
        <div className="flex items-center space-x-3.5">
          <div className="h-14 w-12 flex items-center justify-center shrink-0">
            <img 
              src="/emblem.svg" 
              alt="State Emblem of India" 
              className="h-full w-auto object-contain drop-shadow-xs"
            />
          </div>

          <div className="border-l border-slate-300 pl-3">
            <h3 className="text-xs font-bold text-slate-800 leading-tight">
              भारत सरकार <span className="font-normal text-slate-400">•</span> GOVERNMENT OF INDIA
            </h3>
            <p className="text-[11px] font-bold text-[#0a2540] leading-tight mt-0.5">
              सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय
            </p>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-tight">
              MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
            </p>
          </div>
        </div>

        {/* Center: Official InfraSight AI Logo */}
        <div className="flex items-center border-l-0 lg:border-l border-slate-200 lg:pl-4">
          <div className="h-13 flex items-center">
            <img 
              src="/infrasight-logo.svg" 
              alt="InfraSight AI Logo" 
              className="h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setActiveTab('dashboard')}
            />
          </div>
        </div>

        {/* Right: Search & April 2026 Live Drop Status */}
        <div className="flex items-center space-x-3">
          <div className="relative w-60 sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 1,981 projects by name, code..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
            />
          </div>

          <div className="hidden xl:flex items-center space-x-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-slate-700 font-semibold text-[11px]">April 2026 Cycle</span>
          </div>
        </div>

      </div>

      {/* Official Primary Government Navigation Menu Bar */}
      <div className="bg-[#0a2540] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-1 no-scrollbar">
            {navLinks.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 rounded-md flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sm font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-red-500 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
