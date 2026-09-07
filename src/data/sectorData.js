// Sector Peer Benchmarking & Model Evaluation Data (MoSPI Statistical Validation)

export const SECTOR_BENCHMARKS = [
  {
    sector: "Railways",
    ministry: "Ministry of Railways",
    projectCount: 248,
    totalValueCr: 685000,
    avgCostOverrunPct: 44.2,
    avgTimeDelayMonths: 48.5,
    criticalRiskPct: 28.5,
    cufModelAccuracyPct: 62.4,
    extendedModelAccuracyPct: 88.7,
    predictiveLiftPct: +26.3
  },
  {
    sector: "Road Transport & Highways",
    ministry: "Ministry of Road Transport & Highways",
    projectCount: 712,
    totalValueCr: 412000,
    avgCostOverrunPct: 14.8,
    avgTimeDelayMonths: 22.1,
    criticalRiskPct: 16.2,
    cufModelAccuracyPct: 68.1,
    extendedModelAccuracyPct: 89.2,
    predictiveLiftPct: +21.1
  },
  {
    sector: "Power / Atomic Energy",
    ministry: "Ministry of Power / DAE",
    projectCount: 184,
    totalValueCr: 942000,
    avgCostOverrunPct: 32.6,
    avgTimeDelayMonths: 41.0,
    criticalRiskPct: 22.8,
    cufModelAccuracyPct: 59.8,
    extendedModelAccuracyPct: 86.4,
    predictiveLiftPct: +26.6
  },
  {
    sector: "Petroleum & Natural Gas",
    ministry: "Ministry of Petroleum & Natural Gas",
    projectCount: 156,
    totalValueCr: 418000,
    avgCostOverrunPct: 24.5,
    avgTimeDelayMonths: 28.4,
    criticalRiskPct: 19.5,
    cufModelAccuracyPct: 65.5,
    extendedModelAccuracyPct: 87.9,
    predictiveLiftPct: +22.4
  },
  {
    sector: "Coal",
    ministry: "Ministry of Coal",
    projectCount: 122,
    totalValueCr: 185000,
    avgCostOverrunPct: 18.2,
    avgTimeDelayMonths: 31.0,
    criticalRiskPct: 14.2,
    cufModelAccuracyPct: 64.0,
    extendedModelAccuracyPct: 83.5,
    predictiveLiftPct: +19.5
  },
  {
    sector: "Water Resources / Jal Shakti",
    ministry: "Ministry of Jal Shakti",
    projectCount: 94,
    totalValueCr: 289000,
    avgCostOverrunPct: 38.9,
    avgTimeDelayMonths: 54.2,
    criticalRiskPct: 31.0,
    cufModelAccuracyPct: 54.2,
    extendedModelAccuracyPct: 84.1,
    predictiveLiftPct: +29.9
  }
];

// Baseline vs ML Model Comparison Metrics
export const MODEL_EVALUATION_METRICS = {
  baselineModels: [
    {
      name: "Multiple Linear Regression (OLS)",
      type: "Statistical Baseline",
      rmseCostOverrunPct: 28.4,
      maeCostOverrunPct: 21.2,
      rmseTimeDelayMonths: 18.6,
      precisionRiskClassification: 0.61,
      recallRiskClassification: 0.58,
      f1Score: 0.59,
      rocAuc: 0.65
    },
    {
      name: "ARIMA Time-Series (Milestone Trend)",
      type: "Statistical Baseline",
      rmseCostOverrunPct: 24.1,
      maeCostOverrunPct: 18.5,
      rmseTimeDelayMonths: 14.2,
      precisionRiskClassification: 0.66,
      recallRiskClassification: 0.64,
      f1Score: 0.65,
      rocAuc: 0.71
    }
  ],
  mlModels: [
    {
      name: "XGBoost Regressor & Classifier (CUF Fields Only)",
      type: "Machine Learning (CUF)",
      rmseCostOverrunPct: 16.8,
      maeCostOverrunPct: 11.4,
      rmseTimeDelayMonths: 9.8,
      precisionRiskClassification: 0.79,
      recallRiskClassification: 0.77,
      f1Score: 0.78,
      rocAuc: 0.83
    },
    {
      name: "LightGBM + Extended Variables (Weather, Steel Index, Land)",
      type: "Machine Learning (CUF + Extended)",
      rmseCostOverrunPct: 9.2,
      maeCostOverrunPct: 6.1,
      rmseTimeDelayMonths: 4.8,
      precisionRiskClassification: 0.91,
      recallRiskClassification: 0.89,
      f1Score: 0.90,
      rocAuc: 0.94
    }
  ]
};

// Variable Importance & Incremental Predictive Lift Breakdown
export const VARIABLE_POWER_BREAKDOWN = [
  { variableGroup: "Approved & Revised Cost Ratio (CUF)", category: "CUF Standard", shapImportance: 0.24, predictivePowerScore: 82 },
  { variableGroup: "Milestone Delay Trajectory (CUF)", category: "CUF Standard", shapImportance: 0.21, predictivePowerScore: 78 },
  { variableGroup: "Financial vs Physical Progress Ratio (CUF)", category: "CUF Standard", shapImportance: 0.18, predictivePowerScore: 72 },
  { variableGroup: "Land Acquisition Handover Status (CUF/Ext)", category: "CUF + Extended", shapImportance: 0.15, predictivePowerScore: 88 },
  { variableGroup: "Regional Monsoon Disruption Days (Extended)", category: "Extended Signal", shapImportance: 0.11, predictivePowerScore: 84 },
  { variableGroup: "Commodity Price Index (Steel/Cement) (Extended)", category: "Extended Signal", shapImportance: 0.07, predictivePowerScore: 79 },
  { variableGroup: "Contractor Financial Stress & Liquidity Score (Extended)", category: "Extended Signal", shapImportance: 0.04, predictivePowerScore: 75 }
];
