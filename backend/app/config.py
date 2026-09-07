import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "InfraSight AI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production-prototype"
    
    # Data Connector Source Configuration
    DATA_SOURCE: str = os.getenv("DATA_SOURCE", "OFFICIAL_REPORT")
    CONNECTOR_MODE: str = os.getenv("CONNECTOR_MODE", "OFFICIAL_REPORT")
    OFFICIAL_REPORTING_PERIOD: str = "2026-04"
    CARTO_API_KEY: str = os.getenv("CARTO_API_KEY", "cb1_2zow_1_b01cd98ba6a845a80da1ebdd")
    PAIMANA_BASE_URL: str = os.getenv("PAIMANA_BASE_URL", "https://paimana-proj.mospi.gov.in")
    PAIMANA_API_URL: str = os.getenv("PAIMANA_API_URL", "")
    PAIMANA_API_KEY: str = os.getenv("PAIMANA_API_KEY", "")
    
    # Database Configuration - MongoDB Primary Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", os.getenv("MONGO_URL", "mongodb://localhost:27017"))
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "infrasight_ai")
    
    # Secondary / Legacy embedded relational database URL fallback
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./infrasight.db")
    
    # Configurable Risk Thresholds
    RISK_THRESHOLD_CRITICAL: float = 90.0
    RISK_THRESHOLD_HIGH: float = 70.0
    RISK_THRESHOLD_MODERATE: float = 45.0
    
    # Priority Weightings: Risk, Financial Exposure, Schedule Impact, Confidence
    PRIORITY_WEIGHT_RISK: float = 0.35
    PRIORITY_WEIGHT_EXPOSURE: float = 0.35
    PRIORITY_WEIGHT_COST: float = 0.35
    PRIORITY_WEIGHT_SCHEDULE: float = 0.20
    PRIORITY_WEIGHT_CONFIDENCE: float = 0.10

    class Config:
        env_file = (
            os.path.join(os.path.dirname(__file__), "..", ".env"),
            os.path.join(os.path.dirname(__file__), "..", "..", ".env"),
            ".env"
        )
        extra = "ignore"

settings = Settings()
