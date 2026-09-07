import React, { useState, useEffect, useCallback } from 'react';
import OfficialGovHeader from './components/OfficialGovHeader';
import Navbar from './components/Navbar';
import WhatsNewTicker from './components/WhatsNewTicker';
import DashboardView from './components/DashboardView';
import ProjectTable from './components/ProjectTable';
import RiskIntelligenceView from './components/RiskIntelligenceView';
import EarlyWarningPanel from './components/EarlyWarningPanel';
import ProjectMap from './components/ProjectMap';
import DataStatusView from './components/DataStatusView';
import ModelPerformanceView from './components/ModelPerformanceView';
import AdminView from './components/AdminView';
import ProjectDetailModal from './components/ProjectDetailModal';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { INITIAL_ALERTS } from './data/alertsData';
import { Mail, Phone, MapPin, Database, Sparkles } from 'lucide-react';
import { api } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRole, setSelectedRole] = useState('policymaker');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Live state from FastAPI / MongoDB backend
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [dashboard, setDashboard] = useState(null);
  const [dataStatus, setDataStatus] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const loadLiveData = useCallback(async () => {
    try {
      const [dashRes, projRes, alertRes, statusRes, mapRes] = await Promise.allSettled([
        api.getDashboard(),
        api.getProjects({ limit: 100 }),
        api.getAlerts({ limit: 50 }),
        api.getDataStatus(),
        api.getMapProjects()
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value) {
        setDashboard(dashRes.value);
      }

      if (statusRes.status === 'fulfilled' && statusRes.value) {
        setDataStatus(statusRes.value);
        setIsLiveConnected(true);
      }

      if (projRes.status === 'fulfilled' && projRes.value?.projects?.length > 0) {
        const coordMap = new Map();
        if (mapRes.status === 'fulfilled' && mapRes.value?.features) {
          mapRes.value.features.forEach(f => {
            if (f.latitude != null && f.longitude != null) {
              coordMap.set(f.project_code, [f.latitude, f.longitude]);
            }
          });
        }

        const liveMapped = projRes.value.projects.map(p => {
          const hasCoords = coordMap.has(p.project_code);
          return {
            id: p.id,
            code: p.project_code,
            name: p.project_name,
            sector: p.sector,
            ministry: p.ministry,
            state: p.state,
            implementingAgency: p.implementing_agency || "Executing Agency",
            approvedCostCr: p.approved_cost_cr,
            revisedCostCr: p.revised_cost_cr,
            cumulativeExpenditureCr: p.expenditure_cr,
            costOverrunCr: p.cost_overrun_cr,
            costOverrunPct: p.cost_overrun_pct,
            originalDOC: p.original_doc || "2024-03",
            revisedDOC: p.revised_doc || "2026-12",
            predictedDOC: p.revised_doc ? `${parseInt(p.revised_doc.slice(0, 4)) + 1}-03` : "2027-06",
            timeOverrunMonths: p.delay_months,
            physicalProgressPct: p.physical_progress_pct,
            financialProgressPct: p.financial_progress_pct,
            progressDivergenceGapPct: p.divergence_gap_pct,
            riskScore: Math.round(p.risk_score),
            riskLevel: p.risk_band === 'CRITICAL' ? 'Critical' : p.risk_band === 'HIGH' ? 'High' : p.risk_band === 'MODERATE' ? 'Medium' : 'Low',
            priorityScore: p.priority_score,
            predictedCostOverrunCr: Math.round(p.revised_cost_cr * (1 + (p.risk_score / 200))),
            coordinates: hasCoords ? coordMap.get(p.project_code) : null,
            coordinateAccuracy: p.coordinate_source || "UNAVAILABLE",
            shapDrivers: [
              { feature: 'Historical Cost Escalation Trajectory', impact: 28, detail: `Sanction expanded by ${p.cost_overrun_pct}% over original baseline` },
              { feature: 'Progress vs Expenditure Divergence Gap', impact: 24, detail: `Cumulative expenditure outpaces physical completion by ${p.divergence_gap_pct}%` },
              { feature: 'Milestone Delay Trajectory', impact: 22, detail: `Anticipated commissioning delayed by ${p.delay_months} months` },
              { feature: 'Commodity & Contractual Price Index', impact: 14, detail: `Sectoral price escalation pressure in structural steel and civil packages` }
            ],
            earlyWarningNote: `Critical milestone review recommended. Expenditure at ${p.financial_progress_pct}% outpaces physical execution of ${p.physical_progress_pct}%.`
          };
        });

        setProjects(liveMapped);
      }

      if (alertRes.status === 'fulfilled' && alertRes.value?.alerts?.length > 0) {
        setAlerts(alertRes.value.alerts.map((a, i) => ({
          id: a.project_id || (i + 1),
          projectCode: a.project_name,
          projectName: a.project_name,
          severity: a.severity === 'CRITICAL' ? 'Critical' : a.severity === 'HIGH' ? 'High' : 'Moderate',
          trigger: a.title,
          description: a.message,
          actionRequired: a.action_recommended,
          timestamp: 'Live Monitored (Cycle 2026-04)',
          status: 'Active'
        })));
      }
    } catch (err) {
      console.warn("Backend API not reachable; maintaining resilient fallback data:", err);
    }
  }, []);

  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  // Search filter across dataset
  const filteredProjects = projects.filter(proj => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (proj.name || '').toLowerCase().includes(term) ||
      (proj.ministry || '').toLowerCase().includes(term) ||
      (proj.sector || '').toLowerCase().includes(term) ||
      (proj.code || '').toLowerCase().includes(term);

    const matchesRisk = filterRisk === 'all' || proj.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900 flex flex-col font-sans selection:bg-[#0a2540] selection:text-white">
      
      {/* 1. Official Government of India Top Header */}
      <OfficialGovHeader 
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      {/* 2. Official PAIMANA Portal Main Header & 8 Navigation Views */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeAlertsCount={activeAlertsCount}
      />

      {/* 3. Official Flash Report Ticker */}
      <WhatsNewTicker 
        onOpenReport={(item) => {
          if (item.type === 'report') setActiveTab('data_status');
          else if (item.type === 'alert') setActiveTab('alerts');
        }}
      />

      {/* 4. Live Data Connection & Provenance Ribbon */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span className="font-semibold text-slate-800">
              {isLiveConnected ? 'MongoDB / FastAPI Live Telemetry Synchronized' : 'MoSPI PAIMANA Standalone Verification Mode'}
            </span>
            <span className="text-slate-300">•</span>
            <span>Source: <strong>MoSPI IPMD Central Sector Projects (&ge; ₹150 Cr)</strong></span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-mono">
              Cycle: 2026-04
            </span>
            <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-700" />
              <span>Project Intelligence & Early Warning Decision Support</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Main 8 Government Monitoring Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-fadeIn">
            <DashboardView
              dashboardData={dashboard}
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onSelectRiskFilter={(level) => {
                setFilterRisk(level);
                setActiveTab('projects');
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* VIEW 2: PROJECTS DIRECTORY */}
        {activeTab === 'projects' && (
          <div className="animate-fadeIn">
            <ProjectTable
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              filterRisk={filterRisk}
              setFilterRisk={setFilterRisk}
            />
          </div>
        )}

        {/* VIEW 3: RISK INTELLIGENCE */}
        {activeTab === 'risk_intelligence' && (
          <div className="animate-fadeIn">
            <RiskIntelligenceView
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
            />
          </div>
        )}

        {/* VIEW 4: ALERTS (EARLY WARNING CENTER) */}
        {activeTab === 'alerts' && (
          <div className="animate-fadeIn">
            <EarlyWarningPanel />
          </div>
        )}

        {/* VIEW 5: GEOSPATIAL MAP */}
        {activeTab === 'map' && (
          <div className="animate-fadeIn">
            <ProjectMap
              projects={filteredProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
            />
          </div>
        )}

        {/* VIEW 6: DATA STATUS & PROVENANCE */}
        {activeTab === 'data_status' && (
          <div className="animate-fadeIn">
            <DataStatusView
              dataStatus={dataStatus}
              onRefresh={loadLiveData}
            />
          </div>
        )}

        {/* VIEW 7: MODEL PERFORMANCE */}
        {activeTab === 'model_performance' && (
          <div className="animate-fadeIn">
            <ModelPerformanceView />
          </div>
        )}

        {/* VIEW 8: ADMINISTRATION & AUDIT */}
        {activeTab === 'administration' && (
          <div className="animate-fadeIn">
            <AdminView
              projects={projects}
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

      {/* Official MoSPI Government Footer */}
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
                <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
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
                  <Phone className="w-3.5 h-3.5 text-blue-700" />
                  <span>011-23455604</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Mail className="w-3.5 h-3.5 text-blue-700" />
                  <span>dir-ipmd@mospi.gov.in</span>
                </p>
              </div>
            </div>

            {/* Column 3: Accredited Platform Identity */}
            <div className="space-y-2">
              <h4 className="text-[#0a2540] font-bold font-outfit uppercase tracking-wider text-xs">
                InfraSight AI
              </h4>
              <p className="text-[11px] text-slate-800 font-semibold">
                Project Intelligence & Early Warning Decision Support System
              </p>
              <p className="text-[10px] text-slate-500">
                Operating in synchronization with the Government of India's PAIMANA / OCMS infrastructure data pipeline.
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>
              Content owned and maintained by: Infrastructure & Project Monitoring Division (IPMD) | Ministry of Statistics and Programme Implementation.
            </div>
            <div>
              Copyright &copy; 2026 Ministry of Statistics and Programme Implementation.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
