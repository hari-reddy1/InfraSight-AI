import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_code = Column(String(64), unique=True, index=True, nullable=False)
    project_name = Column(String(256), index=True, nullable=False)
    sector = Column(String(128), index=True, nullable=False)
    ministry = Column(String(128), index=True, nullable=False)
    state = Column(String(128), index=True, nullable=False)
    implementing_agency = Column(String(128), nullable=True)
    
    # Coordinates & Precision tracking (Zero fabricated coordinates)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    coordinate_source = Column(String(64), nullable=True) # e.g. "OFFICIAL_SURVEY", "UNAVAILABLE"
    coordinate_accuracy = Column(String(32), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    snapshots = relationship("ProjectSnapshot", back_populates="project", cascade="all, delete-orphan")
    predictions = relationship("RiskPrediction", back_populates="project", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="project", cascade="all, delete-orphan")

class ProjectSnapshot(Base):
    __tablename__ = "project_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True, nullable=False)
    reporting_period = Column(String(16), index=True, nullable=False) # e.g. "2026-04"
    
    # Financial fields
    approved_cost_cr = Column(Float, nullable=False)
    revised_cost_cr = Column(Float, nullable=False)
    expenditure_cr = Column(Float, nullable=False)
    
    # Timeline fields
    original_doc = Column(String(32), nullable=True)
    revised_doc = Column(String(32), nullable=True)
    time_overrun_months = Column(Integer, default=0)
    
    # Physical and milestone metrics
    physical_progress_pct = Column(Float, default=0.0)
    financial_progress_pct = Column(Float, default=0.0)
    milestones_completed = Column(Integer, default=0)
    total_milestones = Column(Integer, default=0)
    land_acquired_pct = Column(Float, default=100.0)
    
    # Extended external signals
    monsoon_disruption_days = Column(Integer, default=0)
    geological_surprises_index = Column(Float, default=0.0)
    contractor_financial_stress_score = Column(Float, default=0.0)
    commodity_steel_escalation_pct = Column(Float, default=0.0)
    
    # Provenance
    data_source = Column(String(64), nullable=False) # e.g. "OFFICIAL_REPORT", "PAIMANA_PUBLIC"
    source_record_id = Column(String(64), nullable=True)
    retrieved_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    project = relationship("Project", back_populates="snapshots")

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True, nullable=False)
    reporting_period = Column(String(16), index=True, nullable=False)
    
    cost_overrun_prob = Column(Float, nullable=False)
    time_overrun_prob = Column(Float, nullable=False)
    predicted_final_cost_cr = Column(Float, nullable=False)
    predicted_delay_months = Column(Integer, nullable=False)
    
    overall_risk_score = Column(Float, nullable=False) # 0 - 100
    risk_band = Column(String(16), nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    priority_score = Column(Float, nullable=False) # Exposure * Risk * Delay
    model_confidence = Column(Float, default=0.85)
    
    model_version = Column(String(32), default="XGBoost-CUF-Ext-v2.4")
    prediction_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    project = relationship("Project", back_populates="predictions")
    explanations = relationship("RiskExplanation", back_populates="prediction", cascade="all, delete-orphan")

class RiskExplanation(Base):
    __tablename__ = "risk_explanations"
    
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("risk_predictions.id"), index=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True, nullable=False)
    
    feature_name = Column(String(128), nullable=False)
    feature_value = Column(Float, nullable=True)
    shap_value = Column(Float, nullable=False)
    impact_pct = Column(Float, nullable=False)
    detail = Column(Text, nullable=True)
    is_predictive_driver = Column(Boolean, default=True)
    
    prediction = relationship("RiskPrediction", back_populates="explanations")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True, nullable=False)
    severity = Column(String(16), nullable=False) # CRITICAL, HIGH, MODERATE, LOW
    alert_type = Column(String(64), nullable=False)
    trigger_metric = Column(String(128), nullable=False)
    trigger_description = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=True)
    
    status = Column(String(32), default="ACTIVE") # ACTIVE, ACKNOWLEDGED, RESOLVED
    assigned_to = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    project = relationship("Project", back_populates="alerts")
    interventions = relationship("Intervention", back_populates="alert")

class Intervention(Base):
    __tablename__ = "interventions"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), index=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True, nullable=False)
    action_taken = Column(Text, nullable=False)
    recorded_by = Column(String(128), nullable=False)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    alert = relationship("Alert", back_populates="interventions")

class DataQualityLog(Base):
    __tablename__ = "data_quality_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    reporting_period = Column(String(16), nullable=False)
    data_source = Column(String(64), nullable=False)
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    duplicate_records = Column(Integer, default=0)
    missing_fields_count = Column(Integer, default=0)
    validation_warnings = Column(JSON, default=list)
    run_at = Column(DateTime, default=datetime.datetime.utcnow)

class SyncRun(Base):
    __tablename__ = "sync_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(64), nullable=False)
    reporting_period = Column(String(16), nullable=False)
    status = Column(String(32), default="PENDING") # PENDING, SUCCESS, FAILED
    records_ingested = Column(Integer, default=0)
    sync_started_at = Column(DateTime, default=datetime.datetime.utcnow)
    sync_completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

class ModelVersion(Base):
    __tablename__ = "model_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(64), nullable=False) # e.g. "XGBoost", "LogisticRegression"
    version = Column(String(32), nullable=False)
    training_period = Column(String(64), nullable=False)
    validation_period = Column(String(64), nullable=False)
    roc_auc = Column(Float, nullable=False)
    pr_auc = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    brier_score = Column(Float, nullable=False)
    top_k_recall = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(64), nullable=False)
    description = Column(Text, nullable=False)
    user_role = Column(String(64), nullable=True)
    metadata_payload = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
