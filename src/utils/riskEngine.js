// PAIMANA-AI Risk Scoring & Utilities

export const formatCurrencyCr = (valueInCr) => {
  if (valueInCr == null) return "₹0 Cr";
  if (valueInCr >= 100000) {
    return `₹${(valueInCr / 100000).toFixed(2)} Lakh Cr`;
  }
  return `₹${valueInCr.toLocaleString('en-IN')} Cr`;
};

export const getRiskBadge = (score) => {
  if (score >= 70) {
    return { label: "Critical", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-500" };
  } else if (score >= 45) {
    return { label: "Warning", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-500" };
  } else {
    return { label: "On Track", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-500" };
  }
};

export const computeCompositeRiskScore = (costOverrunPct, timeOverrunMonths, landAcquiredPct, milestonesProgressPct) => {
  // Normalized components
  const costFactor = Math.min(100, Math.max(0, costOverrunPct * 1.2));
  const timeFactor = Math.min(100, Math.max(0, (timeOverrunMonths / 60) * 100));
  const landDeficitFactor = Math.min(100, Math.max(0, (100 - landAcquiredPct) * 1.5));
  const milestoneDeficit = Math.min(100, Math.max(0, (100 - milestonesProgressPct)));

  // Weighted composite score (0 - 100)
  const compositeScore = Math.round(
    costFactor * 0.35 +
    timeFactor * 0.30 +
    landDeficitFactor * 0.20 +
    milestoneDeficit * 0.15
  );

  return Math.min(99, Math.max(5, compositeScore));
};
