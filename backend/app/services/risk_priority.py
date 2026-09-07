"""
InfraSight AI - Multi-Factor Executive Priority Engine
Prioritizes projects requiring senior intervention based on:
"Which projects deserve government attention first?"

Formula:
Priority = (w_risk * Risk_Score + w_exposure * Exposure_Norm + w_schedule * Schedule_Norm) * Confidence * 100
"""

from typing import Dict, Any, List
from app.config import settings

def calculate_priority_score(
    risk_score: float,
    anticipated_cost_cr: float,
    delay_months: float,
    confidence_score: float = 0.85,
    weights: Dict[str, float] = None
) -> Dict[str, Any]:
    """
    Calculate multi-factor priority index (0-100) for government decision support.
    Traceable and fully transparent without black-box weight manipulation.
    """
    if weights is None:
        weights = {
            "risk": settings.PRIORITY_WEIGHT_RISK,
            "cost": settings.PRIORITY_WEIGHT_COST,
            "schedule": settings.PRIORITY_WEIGHT_SCHEDULE,
            "confidence": settings.PRIORITY_WEIGHT_CONFIDENCE,
        }

    # Financial Exposure normalized against 10,000 Cr threshold
    max_exposure_cap = 10000.0
    exposure_norm = min(1.0, max(0.0, anticipated_cost_cr / max_exposure_cap))

    # Schedule impact normalized against 60-month threshold
    max_delay_cap = 60.0
    schedule_norm = min(1.0, max(0.0, delay_months / max_delay_cap))

    # Base weighted sum
    w_sum = weights["risk"] + weights["cost"] + weights["schedule"]
    if w_sum <= 0:
        w_sum = 1.0

    raw_weighted = (
        (weights["risk"] * risk_score) +
        (weights["cost"] * exposure_norm) +
        (weights["schedule"] * schedule_norm)
    ) / w_sum

    # Confidence modulation
    confidence = max(0.1, min(1.0, confidence_score))
    final_score = round(raw_weighted * confidence * 100.0, 1)

    # Priority tier determination
    if final_score >= 70.0:
        tier = "P1_CRITICAL"
        tier_label = "P1 - Critical Priority"
        recommended_action = "Immediate Inter-Ministerial Taskforce Review Required"
    elif final_score >= 45.0:
        tier = "P2_HIGH"
        tier_label = "P2 - High Priority"
        recommended_action = "Quarterly Milestone Audit & Land/Forest Clearance Fast-track"
    elif final_score >= 25.0:
        tier = "P3_MEDIUM"
        tier_label = "P3 - Moderate Priority"
        recommended_action = "Standard OCMS Monthly Monitoring"
    else:
        tier = "P4_LOW"
        tier_label = "P4 - Low / On Track"
        recommended_action = "Routine Milestone Tracking"

    return {
        "priority_score": final_score,
        "priority_tier": tier,
        "priority_tier_label": tier_label,
        "recommended_action": recommended_action,
        "components": {
            "risk_component": round(risk_score, 3),
            "exposure_component": round(exposure_norm, 3),
            "schedule_component": round(schedule_norm, 3),
            "confidence_factor": round(confidence, 3),
            "exposure_cr": round(anticipated_cost_cr, 2),
            "delay_months": round(delay_months, 1)
        }
    }


def rank_project_portfolio(projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Rank an entire list of projects according to Priority Score descending.
    Adds 'priority_rank' integer to each project.
    """
    scored = []
    for p in projects:
        risk_score = p.get("predicted_risk_score", p.get("risk_score", 0.0))
        cost = p.get("latest_anticipated_cost_cr") or p.get("original_cost_cr", 0.0)
        delay = p.get("delay_months", 0.0)
        conf = p.get("confidence_score", 0.85)

        p_eval = calculate_priority_score(risk_score, cost, delay, conf)
        p_copy = dict(p)
        p_copy.update({
            "priority_score": p_eval["priority_score"],
            "priority_tier": p_eval["priority_tier"],
            "priority_tier_label": p_eval["priority_tier_label"],
            "recommended_action": p_eval["recommended_action"],
            "priority_components": p_eval["components"]
        })
        scored.append(p_copy)

    # Sort descending by priority_score, then anticipated_cost_cr
    scored.sort(key=lambda x: (x["priority_score"], x.get("latest_anticipated_cost_cr", 0)), reverse=True)

    for idx, item in enumerate(scored, 1):
        item["priority_rank"] = idx

    return scored
