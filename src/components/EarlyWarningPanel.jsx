import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  UserCheck, 
  Send,
  Filter
} from 'lucide-react';
import { INITIAL_ALERTS, DEFAULT_THRESHOLDS } from '../data/alertsData';

export default function EarlyWarningPanel() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [mitigationInput, setMitigationInput] = useState({});

  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === id) {
        return { ...alert, status: 'Acknowledged' };
      }
      return alert;
    }));
  };

  const handleSaveMitigation = (id) => {
    const text = mitigationInput[id];
    if (!text) return;

    setAlerts(prev => prev.map(alert => {
      if (alert.id === id) {
        return { 
          ...alert, 
          status: 'Resolved',
          recommendedIntervention: `${alert.recommendedIntervention} | Action Recorded: ${text}`
        };
      }
      return alert;
    }));
    setMitigationInput(prev => ({ ...prev, [id]: '' }));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'All') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              Early Warning & Anomaly Alert Engine
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            Proactive alerts triggered automatically when project risk scores, schedule variances, or contractor liquidity indicators breach MoSPI monitoring thresholds.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-lg flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            {alerts.filter(a => a.status === 'Active').length} Active Warning Triggers
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Configurable Threshold Sliders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5 h-fit">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <Sliders className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900 font-outfit">
              Threshold Configuration Controller
            </h3>
          </div>

          {/* Slider 1: Critical Risk Score */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Critical Risk Score Trigger:</span>
              <span className="text-red-600 font-bold">{thresholds.criticalRiskScore}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={thresholds.criticalRiskScore}
              onChange={(e) => setThresholds({ ...thresholds, criticalRiskScore: Number(e.target.value) })}
              className="w-full accent-orange-600 bg-slate-200 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Projects scoring above this trigger immediate Ministry escalation.</p>
          </div>

          {/* Slider 2: Schedule Delay Trigger */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Schedule Delay Trigger:</span>
              <span className="text-amber-700 font-bold">{thresholds.scheduleDelayTriggerMonths} Months</span>
            </div>
            <input
              type="range"
              min="3"
              max="24"
              value={thresholds.scheduleDelayTriggerMonths}
              onChange={(e) => setThresholds({ ...thresholds, scheduleDelayTriggerMonths: Number(e.target.value) })}
              className="w-full accent-amber-600 bg-slate-200 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Triggers when predicted completion slips by more than set months.</p>
          </div>

          {/* Slider 3: Cost Variance Trigger */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700">Cost Escalation Variance:</span>
              <span className="text-purple-700 font-bold">+{thresholds.costVarianceTriggerPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={thresholds.costVarianceTriggerPct}
              onChange={(e) => setThresholds({ ...thresholds, costVarianceTriggerPct: Number(e.target.value) })}
              className="w-full accent-purple-600 bg-slate-200 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Triggers on predicted expenditure expansion vs sanctioned budget.</p>
          </div>

          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thresholds dynamically evaluate on monthly CUF drops.</span>
          </div>
        </div>

        {/* Right Column: Active Alerts Feed & Actions */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Severity Filter Header */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 text-xs text-slate-700 font-bold">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter Severity:</span>
            </div>
            <div className="flex space-x-1">
              {['All', 'Critical', 'High', 'Medium'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    filterSeverity === sev
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`bg-white p-4 rounded-xl border transition-all shadow-xs ${
                  alert.severity === 'Critical' 
                    ? 'border-red-300 bg-red-50/30' 
                    : alert.severity === 'High'
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.severity === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                        alert.severity === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {alert.severity} Alert
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{alert.id}</span>
                      <span className="text-[11px] text-slate-400">• {alert.dateTriggered}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 font-outfit">
                      {alert.projectName}
                    </h4>
                    <p className="text-xs text-slate-600">{alert.ministry}</p>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      alert.status === 'Active' ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse' :
                      alert.status === 'Acknowledged' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Trigger Cause & Recommended Action */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 my-3 text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Anomaly Trigger</span>
                    <p className="text-slate-800 font-medium">{alert.triggerDescription}</p>
                  </div>
                  <div>
                    <span className="text-orange-700 font-bold block text-[10px] uppercase">Recommended Decision-Support Action</span>
                    <p className="text-slate-900 font-medium">{alert.recommendedIntervention}</p>
                  </div>
                </div>

                {/* Action Workflow Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="text-slate-600 text-[11px] flex items-center space-x-1 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Assigned to: <strong className="text-slate-800">{alert.assignedTo}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {alert.status === 'Active' && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-600 text-amber-900 hover:text-white rounded-lg text-xs font-bold transition-colors border border-amber-300 shadow-2xs"
                      >
                        Acknowledge Alert
                      </button>
                    )}

                    {alert.status !== 'Resolved' && (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          placeholder="Record Ministry Action..."
                          value={mitigationInput[alert.id] || ''}
                          onChange={(e) => setMitigationInput({ ...mitigationInput, [alert.id]: e.target.value })}
                          className="bg-white border border-slate-300 text-xs px-2.5 py-1 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                        />
                        <button
                          onClick={() => handleSaveMitigation(alert.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Resolve</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
