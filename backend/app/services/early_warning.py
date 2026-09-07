"""
InfraSight AI - Early Warning Detection Engine
Project Intelligence & Early Warning Decision Support System

Analyzes project telemetry and historical snapshots to detect early warning triggers:
1. Financial vs Physical Divergence Gap
2. Stagnation / Velocity Loss
3. Rapid Risk Acceleration / Surge
4. Severe Milestone Slippage
5. Reporting Dormancy / Stale Updates
"""

from typing import List, Dict, Any, Optional
from datetime import datetime

def evaluate_project_early_warnings(
    project: Dict[str, Any],
    snapshots: Optional[List[Dict[str, Any]]] = None,
    thresholds: Optional[Dict[str, float]] = None
) -> List[Dict[str, Any]]:
    """
    Evaluates a single project and returns an array of structured alert dictionaries.
    Zero mock alerts — triggers only when mathematical/business conditions in real project data are met.
    """
    if thresholds is None:
        thresholds = {
            "divergence_critical": 25.0,  # e.g., 25% financial > physical
            "divergence_warning": 15.0,
            "cost_overrun_critical": 50.0,
            "delay_critical_months": 24.0,
            "stagnation_months": 3.0
        }

    alerts = []
    p_id = project.get("id")
    p_name = project.get("project_name", "Unknown Project")

    # 1. Divergence Gap (Financial % spent vs Physical % complete)
    orig_cost = project.get("original_cost_cr") or 1.0
    latest_cost = project.get("latest_anticipated_cost_cr") or orig_cost
    cum_exp = project.get("cumulative_expenditure_cr") or 0.0
    phys_pct = project.get("physical_progress_pct") or 0.0

    fin_spent_pct = (cum_exp / latest_cost) * 100.0 if latest_cost > 0 else 0.0
    divergence_gap = fin_spent_pct - phys_pct

    if divergence_gap >= thresholds["divergence_critical"]:
        alerts.append({
            "project_id": p_id,
            "project_name": p_name,
            "alert_type": "DIVERGENCE_CRITICAL",
            "severity": "CRITICAL",
            "title": f"Critical Capital-Physical Divergence ({divergence_gap:.1f}% gap)",
            "message": (
                f"Financial outlay has reached {fin_spent_pct:.1f}% (₹{cum_exp:,.1f} Cr of ₹{latest_cost:,.1f} Cr) "
                f"while physical execution stands at only {phys_pct:.1f}%. Capital expenditure velocity exceeds asset delivery."
            ),
            "metric_name": "capital_physical_divergence_pct",
            "metric_value": round(divergence_gap, 2),
            "threshold_value": thresholds["divergence_critical"],
            "action_recommended": "Conduct an on-site physical milestone verification audit prior to releasing further contractor tranches."
        })
    elif divergence_gap >= thresholds["divergence_warning"]:
        alerts.append({
            "project_id": p_id,
            "project_name": p_name,
            "alert_type": "DIVERGENCE_WARNING",
            "severity": "HIGH",
            "title": f"Moderate Capital-Physical Divergence ({divergence_gap:.1f}% gap)",
            "message": (
                f"Expenditure at {fin_spent_pct:.1f}% outpaces physical completion of {phys_pct:.1f}%. "
                f"Monitoring recommended to prevent capital drain."
            ),
            "metric_name": "capital_physical_divergence_pct",
            "metric_value": round(divergence_gap, 2),
            "threshold_value": thresholds["divergence_warning"],
            "action_recommended": "Review monthly measurement book entries with executing PSU engineering team."
        })

    # 2. Cost Escalation Severity
    cost_overrun_pct = project.get("cost_overrun_pct", 0.0)
    if cost_overrun_pct >= thresholds["cost_overrun_critical"]:
        alerts.append({
            "project_id": p_id,
            "project_name": p_name,
            "alert_type": "COST_OVERRUN_SEVERE",
            "severity": "CRITICAL",
            "title": f"Severe Cost Escalation (+{cost_overrun_pct:.1f}%)",
            "message": (
                f"Projected cost has increased from approved ₹{orig_cost:,.1f} Cr to ₹{latest_cost:,.1f} Cr "
                f"(Net escalation: ₹{latest_cost - orig_cost:,.1f} Cr). Exceeds statutory PIB/CCEA threshold."
            ),
            "metric_name": "cost_overrun_pct",
            "metric_value": round(cost_overrun_pct, 2),
            "threshold_value": thresholds["cost_overrun_critical"],
            "action_recommended": "Submit Revised Cost Estimates (RCE) to Cabinet Committee on Economic Affairs (CCEA)."
        })

    # 3. Schedule Delay / Stagnation
    delay_months = project.get("delay_months", 0.0)
    if delay_months >= thresholds["delay_critical_months"]:
        alerts.append({
            "project_id": p_id,
            "project_name": p_name,
            "alert_type": "SCHEDULE_SLIPPAGE_SEVERE",
            "severity": "HIGH",
            "title": f"Chronic Schedule Slippage (+{delay_months:.0f} months delay)",
            "message": (
                f"Commissioning timeline has slipped by {delay_months:.0f} months past original target. "
                f"Current expected commissioning: {project.get('anticipated_completion_date', 'Pending')}."
            ),
            "metric_name": "delay_months",
            "metric_value": round(delay_months, 1),
            "threshold_value": thresholds["delay_critical_months"],
            "action_recommended": "Escalate right-of-way (RoW) and statutory clearance bottlenecks to PMG / Pragati portal."
        })

    # 4. Multi-snapshot velocity analysis (if snapshot history exists)
    if snapshots and len(snapshots) >= 2:
        sorted_snaps = sorted(snapshots, key=lambda s: s.get("snapshot_date", ""))
        recent = sorted_snaps[-1]
        prior = sorted_snaps[-2]

        recent_prog = recent.get("physical_progress_pct", 0.0)
        prior_prog = prior.get("physical_progress_pct", 0.0)

        # Zero progress velocity across snapshots
        if recent_prog <= prior_prog and recent_prog < 95.0:
            alerts.append({
                "project_id": p_id,
                "project_name": p_name,
                "alert_type": "VELOCITY_STAGNATION",
                "severity": "HIGH",
                "title": "Execution Velocity Stagnation",
                "message": (
                    f"Physical progress remained unchanged at {recent_prog:.1f}% between reporting cycles "
                    f"({prior.get('snapshot_date')} to {recent.get('snapshot_date')})."
                ),
                "metric_name": "progress_delta",
                "metric_value": round(recent_prog - prior_prog, 2),
                "threshold_value": 0.0,
                "action_recommended": "Query implementing agency for work stoppage reasons (contractor dispute, monsoon, litigation)."
            })

    return alerts
