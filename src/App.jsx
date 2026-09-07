import React, { useState } from 'react';
import OfficialGovHeader from './components/OfficialGovHeader';
import Navbar from './components/Navbar';
import WhatsNewTicker from './components/WhatsNewTicker';
import ExecutiveKPIs from './components/ExecutiveKPIs';
import PriorityMatrix from './components/PriorityMatrix';
import ProjectMap from './components/ProjectMap';
import ProjectTable from './components/ProjectTable';
import ProjectDetailModal from './components/ProjectDetailModal';
import ModelComparer from './components/ModelComparer';
import EarlyWarningPanel from './components/EarlyWarningPanel';
import SectorBenchmarking from './components/SectorBenchmarking';
import LLMAssistant from './components/LLMAssistant';
import DataIngestion from './components/DataIngestion';
import FlashReportsSection from './components/FlashReportsSection';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { INITIAL_ALERTS } from './data/alertsData';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState('policymaker');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Search filter across dataset
  const filteredProjects = SAMPLE_PROJECTS.filter(proj => {
    const matchesSearch = 
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = filterRisk === 'all' || proj.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const activeAlertsCount = INITIAL_ALERTS.filter(a => a.status === 'Active').length;

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 1. Official Government of India Top Header */}
      <OfficialGovHeader 
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      {/* 2. Official PAIMANA Portal Main Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeAlertsCount={activeAlertsCount}
      />

      {/* 3. Official "What's New" Flash Report Ticker */}
      <WhatsNewTicker 
        onOpenReport={(item) => {
          if (item.type === 'report') setActiveTab('reports');
          else if (item.type === 'alert') setActiveTab('alerts');
        }}
      />

      {/* 4. Main Portal Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: HOME (PORTFOLIO OVERVIEW & PRIORITY MATRIX) */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Executive 4-Tier Risk Distribution KPIs */}
            <ExecutiveKPIs
              onSelectFilter={(level) => {
                setFilterRisk(level);
                setActiveTab('projects');
              }}
            />

            {/* Question 4: Priority Action Matrix (What should Government look at first?) */}
            <PriorityMatrix
              projects={SAMPLE_PROJECTS}
              onSelectProject={(proj) => setSelectedProject(proj)}
            />

            {/* Interactive Geo Map */}
            <ProjectMap
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
            />

            {/* Projects Summary Table */}
            <ProjectTable
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              filterRisk={filterRisk}
              setFilterRisk={setFilterRisk}
            />
          </div>
        )}

        {/* TAB 2: PROJECTS DIRECTORY */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <ProjectTable
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              filterRisk={filterRisk}
              setFilterRisk={setFilterRisk}
            />
          </div>
        )}

        {/* TAB 3: PREDICTIVE MODELS (XGBoost vs Baseline) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <ModelComparer />
          </div>
        )}

        {/* TAB 4: EARLY WARNINGS */}
        {activeTab === 'alerts' && (
          <div className="space-y-6 animate-fadeIn">
            <EarlyWarningPanel />
          </div>
        )}

        {/* TAB 5: SECTOR BENCHMARKING */}
        {activeTab === 'benchmarking' && (
          <div className="space-y-6 animate-fadeIn">
            <SectorBenchmarking />
          </div>
        )}

        {/* TAB 6: LLM INTELLIGENCE ASSISTANT */}
        {activeTab === 'assistant' && (
          <div className="space-y-6 animate-fadeIn">
            <LLMAssistant />
          </div>
        )}

        {/* TAB 7: CUF DATA INGESTION & RETRAINING */}
        {activeTab === 'ingestion' && (
          <div className="space-y-6 animate-fadeIn">
            <DataIngestion />
          </div>
        )}

        {/* TAB 8: PUBLICATIONS & FLASH REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            <FlashReportsSection
              onAskAIAboutReport={(reportTitle) => {
                setActiveTab('assistant');
              }}
            />
          </div>
        )}

      </main>

      {/* Deep-Dive Project Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Official MoSPI Government Footer (Matching https://paimana-proj.mospi.gov.in/) */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            
            {/* Column 1: Ministry Address */}
            <div className="space-y-2">
              <h4 className="text-slate-900 font-bold font-outfit uppercase tracking-wider text-xs">
                Government of India
              </h4>
              <p className="text-slate-800 font-bold">
                Ministry of Statistics and Programme Implementation (MoSPI)
              </p>
              <p className="text-slate-600 flex items-start gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span>Khurshid Lal Bhawan, Janpath, New Delhi-110001 (India)</span>
              </p>
            </div>

            {/* Column 2: Division & Contact */}
            <div className="space-y-2">
              <h4 className="text-slate-900 font-bold font-outfit uppercase tracking-wider text-xs">
                Infrastructure & Project Monitoring Division (IPMD)
              </h4>
              <p className="text-[11px] text-slate-600">
                Tracks Central Sector infrastructure projects costing ₹150 crore and above across 17+ Ministries/Departments.
              </p>
              <div className="space-y-1 text-[11px]">
                <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Phone className="w-3 h-3 text-orange-600" />
                  <span>011-23455604</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Mail className="w-3 h-3 text-orange-600" />
                  <span>dir-ipmd@mospi.gov.in</span>
                </p>
              </div>
            </div>

            {/* Column 3: SIH Project Information */}
            <div className="space-y-2">
              <h4 className="text-orange-700 font-bold font-outfit uppercase tracking-wider text-xs">
                PAIMANA-AI (InfraSight AI)
              </h4>
              <p className="text-[11px] text-slate-700 font-medium">
                AI-Powered Predictive Analytics & Early Warning Decision-Support System
              </p>
              <p className="text-[10px] text-slate-500">
                Smart India Hackathon 2026 (SIH26103) • Developed by Bhojanapu Deva Raj (MITS, JNTUA)
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              Content owned and maintained by: Infrastructure & Project Monitoring Division (IPMD) | Ministry of Statistics and Programme Implementation.
            </div>
            <div>
              Copyright © 2026 Ministry of Statistics and Programme Implementation.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
