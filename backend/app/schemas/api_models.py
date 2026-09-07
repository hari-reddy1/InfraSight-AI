from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class DataStatusResponse(BaseModel):
    source: str
    status: str
    last_sync: str
    reporting_period: str
    record_count: int
    source_url: str
    freshness: str # LIVE, RECENT, STALE

class ProvenanceMeta(BaseModel):
    source: str
    reporting_period: str
    retrieved_at: str
    model_version: Optional[str] = None

class DashboardKPIs(BaseModel):
    total_projects: int
    original_approved_cost_cr: float
    latest_revised_cost_cr: float
    cumulative_expenditure_cr: float
    projects_with_cost_overrun: int
    projects_with_schedule_slippage: int
    projects_with_progress_data: int
    critical_risk_count: int
    high_risk_count: int
    moderate_risk_count: int
    low_risk_count: int

class DistributionItem(BaseModel):
    name: str
    value: float
    count: Optional[int] = None

class DashboardResponse(BaseModel):
    kpis: DashboardKPIs
    risk_distribution: List[DistributionItem]
    risk_by_sector: List[DistributionItem]
    risk_by_ministry: List[DistributionItem]
    cost_escalation_by_sector: List[DistributionItem]
    provenance: ProvenanceMeta

class ProjectListItem(BaseModel):
    id: int
    project_code: str
    project_name: str
    sector: str
    ministry: str
    state: str
    approved_cost_cr: float
    revised_cost_cr: float
    expenditure_cr: float
    original_doc: Optional[str] = None
    revised_doc: Optional[str] = None
    time_overrun_months: int
    physical_progress_pct: float
    financial_progress_pct: float
    overall_risk_score: float
    risk_band: str
    priority_score: float
    prediction_timestamp: str

class SHAPDriver(BaseModel):
    feature_name: str
    shap_value: float
    impact_pct: float
    detail: Optional[str] = None
    is_predictive_driver: bool = True

class ProjectDetailResponse(BaseModel):
    id: int
    project_code: str
    project_name: str
    sector: str
    ministry: str
    state: str
    implementing_agency: Optional[str] = None
    
    # Financial Intelligence
    approved_cost_cr: float
    revised_cost_cr: float
    expenditure_cr: float
    cost_escalation_cr: float
    cost_escalation_pct: float
    expenditure_ratio_pct: float
    
    # Schedule Intelligence
    original_doc: Optional[str] = None
    revised_doc: Optional[str] = None
    time_overrun_months: int
    schedule_status: str
    
    # Progress Intelligence
    physical_progress_pct: float
    financial_progress_pct: float
    progress_divergence_gap_pct: float
    
    # AI Intelligence
    cost_overrun_prob: float
    time_overrun_prob: float
    predicted_final_cost_cr: float
    predicted_delay_months: int
    overall_risk_score: float
    risk_band: str
    priority_score: float
    model_confidence: float
    model_version: str
    prediction_timestamp: str
    
    # Explainability & Alerts
    predictive_drivers: List[SHAPDriver]
    early_warnings: List[Dict[str, Any]]
    
    # Provenance
    provenance: ProvenanceMeta

class AlertItem(BaseModel):
    id: int
    project_id: int
    project_code: str
    project_name: str
    ministry: str
    severity: str
    alert_type: str
    trigger_metric: str
    trigger_description: str
    recommended_action: Optional[str] = None
    status: str
    assigned_to: Optional[str] = None
    created_at: str

class DataQualityResponse(BaseModel):
    reporting_period: str
    data_source: str
    total_records_processed: int
    valid_records: int
    invalid_records: int
    duplicate_records: int
    missing_fields_count: int
    validation_warnings: List[Dict[str, Any]]
    run_at: str

class ModelBenchmarkItem(BaseModel):
    model_name: str
    model_type: str
    training_period: str
    validation_period: str
    roc_auc: float
    pr_auc: float
    precision: float
    recall: float
    f1_score: float
    brier_score: float
    top_k_recall: float
    is_best: bool = False

class ModelPerformanceResponse(BaseModel):
    models: List[ModelBenchmarkItem]
    shap_global_importance: List[Dict[str, Any]]
    temporal_methodology: str
    honest_conclusion: str
    provenance: ProvenanceMeta

class MapProjectItem(BaseModel):
    id: int
    project_code: str
    project_name: str
    sector: str
    ministry: str
    state: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    coordinates_available: bool
    coordinate_source: Optional[str] = None
    overall_risk_score: float
    risk_band: str
    cost_overrun_prob: float
    time_overrun_prob: float
    approved_cost_cr: float
    revised_cost_cr: float
    physical_progress_pct: float
