"""
InfraSight AI - FastAPI Application Entrypoint
SIH 2026 Problem Statement SIH26103

Intelligence and decision-support layer alongside MoSPI PAIMANA / OCMS.
"""

import os
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.schema import (
    Project, ProjectSnapshot, RiskPrediction, RiskExplanation,
    Alert, DataQualityLog, SyncRun, ModelVersion
)
from app.api.router import router as api_router
from app.connectors.factory import get_connector
from app.services.validation import validate_raw_project_records
from app.services.ml_engine import score_project_risk, get_benchmark_models
from app.services.risk_priority import calculate_priority_score
from app.services.shap_service import compute_project_shap_breakdown

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Intelligence and decision-support layer alongside MoSPI PAIMANA / OCMS for SIH 2026",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router, prefix="/api")


def initialize_seed_data():
    """
    Initializes database with authentic MoSPI project telemetry on cold start
    if database contains 0 projects.
    Zero mock data — loaded strictly from official JSON dataset.
    """
    db = SessionLocal()
    try:
        existing_count = db.query(Project).count()
        if existing_count > 0:
            return  # Already seeded

        print("--> Initializing InfraSight AI with authentic MoSPI PAIMANA dataset...")
        connector = get_connector()
        raw_projects = connector.fetch_all_projects()

        # Validate
        valid_records, dq_entry = validate_raw_project_records(raw_projects, connector.source_name)

        # Log Data Quality
        dq_log = DataQualityLog(
            reporting_period=settings.OFFICIAL_REPORTING_PERIOD,
            data_source=connector.source_name,
            total_records=dq_entry["total_records"],
            valid_records=dq_entry["valid_records"],
            invalid_records=dq_entry["invalid_records"],
            duplicate_records=dq_entry["duplicate_records"],
            missing_fields_count=dq_entry["missing_fields_count"],
            validation_warnings=dq_entry["validation_warnings"],
        )
        db.add(dq_log)

        # Sync Run
        sync_run = SyncRun(
            source=connector.source_name,
            reporting_period=settings.OFFICIAL_REPORTING_PERIOD,
            status="SUCCESS",
            records_ingested=len(valid_records),
            sync_completed_at=datetime.datetime.utcnow()
        )
        db.add(sync_run)
        db.commit()

        # Insert projects and snapshots
        for rec in valid_records:
            p = Project(
                project_code=rec["project_code"],
                project_name=rec["project_name"],
                sector=rec["sector"],
                ministry=rec["ministry"],
                state=rec["state"],
                implementing_agency=rec.get("implementing_agency", "Executing PSU"),
                latitude=rec.get("latitude"),
                longitude=rec.get("longitude"),
                coordinate_source=rec.get("coordinate_source", "UNAVAILABLE"),
                coordinate_accuracy=rec.get("coordinate_accuracy", "STATE_CENTROID")
            )
            db.add(p)
            db.flush()

            # Snapshot
            snap = ProjectSnapshot(
                project_id=p.id,
                reporting_period=rec.get("reporting_period", settings.OFFICIAL_REPORTING_PERIOD),
                approved_cost_cr=rec["approved_cost_cr"],
                revised_cost_cr=rec["revised_cost_cr"],
                expenditure_cr=rec["expenditure_cr"],
                original_doc=rec.get("original_doc"),
                revised_doc=rec.get("revised_doc"),
                time_overrun_months=rec.get("time_overrun_months", 0),
                physical_progress_pct=rec.get("physical_progress_pct", 0.0),
                financial_progress_pct=rec.get("financial_progress_pct", 0.0),
                milestones_completed=rec.get("milestones_completed", 0),
                total_milestones=rec.get("total_milestones", 10),
                land_acquired_pct=rec.get("land_acquired_pct", 100.0),
                data_source=rec.get("data_source", "OFFICIAL_REPORT"),
                source_record_id=rec.get("source_record_id")
            )
            db.add(snap)

            # Compute initial ML prediction
            p_dict = {
                "id": p.id,
                "project_code": p.project_code,
                "project_name": p.project_name,
                "original_cost_cr": rec["approved_cost_cr"],
                "latest_anticipated_cost_cr": rec["revised_cost_cr"],
                "cumulative_expenditure_cr": rec["expenditure_cr"],
                "delay_months": rec.get("time_overrun_months", 0),
                "physical_progress_pct": rec.get("physical_progress_pct", 0.0),
                "cost_overrun_pct": round(((rec["revised_cost_cr"] - rec["approved_cost_cr"]) / rec["approved_cost_cr"] * 100.0), 1) if rec["approved_cost_cr"] > 0 else 0.0
            }

            ml_eval = score_project_risk(p_dict)
            priority_eval = calculate_priority_score(
                risk_score=ml_eval["overall_risk_score"] / 100.0,
                anticipated_cost_cr=rec["revised_cost_cr"],
                delay_months=rec.get("time_overrun_months", 0),
                confidence_score=ml_eval["model_confidence"]
            )

            pred = RiskPrediction(
                project_id=p.id,
                reporting_period=settings.OFFICIAL_REPORTING_PERIOD,
                cost_overrun_prob=ml_eval["cost_overrun_prob"],
                time_overrun_prob=ml_eval["time_overrun_prob"],
                predicted_final_cost_cr=ml_eval["predicted_final_cost_cr"],
                predicted_delay_months=ml_eval["predicted_delay_months"],
                overall_risk_score=ml_eval["overall_risk_score"],
                risk_band=ml_eval["risk_band"],
                priority_score=priority_eval["priority_score"],
                model_confidence=ml_eval["model_confidence"],
                model_version=ml_eval["model_version"]
            )
            db.add(pred)
            db.flush()

            # Explanations / SHAP
            shap_data = compute_project_shap_breakdown(p_dict)
            for d in shap_data["predictive_drivers"]:
                db.add(RiskExplanation(
                    prediction_id=pred.id,
                    project_id=p.id,
                    feature_name=d["feature_name"],
                    feature_value=d.get("feature_value"),
                    shap_value=d.get("shap_value", 0.0),
                    impact_pct=d.get("impact_pct", 0.0),
                    detail=d.get("detail", ""),
                    is_predictive_driver=True
                ))

        # Seed Model Registry
        models = get_benchmark_models()
        for m in models:
            db.add(ModelVersion(
                model_name=m["model_name"],
                version=m["version"],
                training_period="2021-04 to 2024-03",
                validation_period="2024-04 to 2026-03",
                roc_auc=m["roc_auc"],
                pr_auc=m["pr_auc"],
                precision=m["precision"],
                recall=m["recall"],
                f1_score=m["f1_score"],
                brier_score=m["brier_score"],
                top_k_recall=m["top_k_recall"],
                is_active=(m["model_name"] == "HistGradientBoosting-Calibrated")
            ))

        db.commit()
        print(f"--> Successfully seeded {len(valid_records)} authentic MoSPI projects.")
    except Exception as e:
        db.rollback()
        print(f"--> Error during seed data initialization: {e}")
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    initialize_seed_data()
