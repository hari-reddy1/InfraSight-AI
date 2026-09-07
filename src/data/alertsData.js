// Active Early Warning Alerts Dataset for MoSPI PAIMANA-AI

export const INITIAL_ALERTS = [
  {
    id: "ALT-2026-0412",
    projectId: "PRJ-RLW-2006-0042",
    projectName: "Udhampur-Srinagar-Baramulla Rail Link (USBRL)",
    ministry: "Ministry of Railways",
    severity: "Critical", // Critical, High, Medium
    triggerMetric: "Predicted Time Overrun > 200 Months & Tunnelling Anomaly",
    riskScore: 92,
    dateTriggered: "2026-04-12",
    status: "Active", // Active, Acknowledged, Resolved
    assignedTo: "IPMD Rail Cell & IRCON CMD",
    triggerDescription: "ML Engine detected a 6-month projected delay in Tunnel T-50 final lining works due to water ingress. Risk score escalated to 92.",
    recommendedIntervention: "Deploy specialized Norwegian hard-rock grouting team and authorize high-pressure pumping sub-contract."
  },
  {
    id: "ALT-2026-0410",
    projectId: "PRJ-RTH-2018-0112",
    projectName: "Zojila Tunnel Project (NH-1)",
    ministry: "Ministry of Road Transport & Highways",
    severity: "Critical",
    triggerMetric: "Contractor Financial Stress Score > 0.70",
    riskScore: 78,
    dateTriggered: "2026-04-10",
    status: "Acknowledged",
    assignedTo: "NHIDCL Project Director & MoRTH Secretary",
    triggerDescription: "Subcontractor liquidity deficit flagged by extended variable model. Excavation speed dropped to 1.8m/day against 4.2m benchmark.",
    recommendedIntervention: "Interim milestone payment release against bank guarantee to restore site working capital."
  },
  {
    id: "ALT-2026-0408",
    projectId: "PRJ-WAT-2021-0410",
    projectName: "Ken-Betwa River Interlinking National Project",
    ministry: "Ministry of Jal Shakti",
    severity: "Critical",
    triggerMetric: "Land Acquisition Handover < 45% at Year 4",
    riskScore: 82,
    dateTriggered: "2026-04-08",
    status: "Active",
    assignedTo: "KBLPA Chief Engineer & MP Revenue Secretary",
    triggerDescription: "Panna Tiger Reserve core area land transfer pending approval. Cost escalation model predicts ₹5,700 Cr extra interest during construction.",
    recommendedIntervention: "Schedule joint empowered committee review between MoEFCC, MoJS, and MP State Government."
  },
  {
    id: "ALT-2026-0405",
    projectId: "PRJ-PET-2019-0201",
    projectName: "Barmer Refinery & Petrochemical Complex",
    ministry: "Ministry of Petroleum & Natural Gas",
    severity: "High",
    triggerMetric: "Steel Commodity Escalation > 25%",
    riskScore: 72,
    dateTriggered: "2026-04-05",
    status: "Acknowledged",
    assignedTo: "HPCL Director (Refineries) & MoPNG Monitor",
    triggerDescription: "Heavy pressure vessel fabrication costs expanded by 28.5% over Q1 2026 baseline. Revised completion pushed to April 2027.",
    recommendedIntervention: "Bulk central procurement price lock with SAIL/JSW for remaining 45,000 MT structural steel."
  },
  {
    id: "ALT-2026-0328",
    projectId: "PRJ-RLW-2018-0077",
    projectName: "Mumbai-Ahmedabad High Speed Rail",
    ministry: "Ministry of Railways",
    severity: "Medium",
    triggerMetric: "Milestone Slippage Rate > 15%",
    riskScore: 66,
    dateTriggered: "2026-03-28",
    status: "Active",
    assignedTo: "NHSRCL Managing Director",
    triggerDescription: "Undersea tunnel TBM assembly behind schedule by 6 weeks at Vikhroli shaft site.",
    recommendedIntervention: "Increase Japanese technical assembly crew shifts from 2 to 3."
  }
];

export const DEFAULT_THRESHOLDS = {
  criticalRiskScore: 75,
  warningRiskScore: 50,
  scheduleDelayTriggerMonths: 6,
  costVarianceTriggerPct: 15,
  landAcquisitionDeficitPct: 20
};
