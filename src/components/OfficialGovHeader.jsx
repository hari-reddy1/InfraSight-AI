import React from 'react';
import { Globe, UserCheck } from 'lucide-react';

export default function OfficialGovHeader({ selectedRole, setSelectedRole }) {
  const roles = [
    { id: 'policymaker', label: 'Ministry / IPMD Officer' },
    { id: 'project_officer', label: 'Project Director (Line Ministry)' },
    { id: 'agency_user', label: 'Implementing Agency' },
    { id: 'data_scientist', label: 'Data Scientist (Admin)' },
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-700 text-[11px] border-b border-slate-200">
      {/* Topmost utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-4 h-2.5 rounded-xs tricolor-bar"></span>
            <span className="font-bold text-slate-800">भारत सरकार | Government of India</span>
          </div>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="hidden md:inline text-slate-600 font-medium">
            सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय | MoSPI
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Officer Persona Role Switcher */}
          <div className="flex items-center space-x-1.5 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs">
            <UserCheck className="w-3 h-3 text-orange-600" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-[11px] text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id} className="bg-white text-slate-800">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1 text-[10px] text-slate-600 font-semibold">
            <button className="hover:bg-slate-200 transition-colors px-1.5 py-0.5 bg-white rounded border border-slate-300">A-</button>
            <button className="hover:bg-slate-200 transition-colors px-1.5 py-0.5 bg-white rounded border border-slate-300">A</button>
            <button className="hover:bg-slate-200 transition-colors px-1.5 py-0.5 bg-white rounded border border-slate-300 font-bold">A+</button>
          </div>

          <div className="flex items-center space-x-1 text-slate-700 font-medium">
            <Globe className="w-3 h-3 text-orange-600" />
            <span className="text-[10px]">English / हिन्दी</span>
          </div>
        </div>
      </div>
      <div className="tricolor-bar w-full"></div>
    </div>
  );
}
