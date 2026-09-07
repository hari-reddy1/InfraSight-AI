import os
import json
from typing import List, Dict, Any, Tuple
from app.connectors.base import BaseConnector

class OfficialReportConnector(BaseConnector):
    """
    Connects to authorized machine-readable MoSPI Project Monitoring & Flash Report data (April 2026 reporting cycle).
    Preserves exact CUF fields and coordinates provenance.
    """
    
    def __init__(self, data_path: str = None):
        self.source_name = "MoSPI_OFFICIAL_REPORT"
        self.reporting_period = "2026-04"
        self.data_path = data_path or os.path.join(os.path.dirname(__file__), "..", "..", "data", "official_paimana_projects.json")

    def get_source_name(self) -> str:
        return self.source_name
        
    def get_reporting_period(self) -> str:
        return self.reporting_period
        
    def test_connection(self) -> Tuple[bool, str]:
        if os.path.exists(self.data_path):
            return True, f"Connected to Authorized Official Report Store: {os.path.basename(self.data_path)}"
        return False, f"Official report file not found at {self.data_path}"
        
    def fetch_records(self) -> List[Dict[str, Any]]:
        if not os.path.exists(self.data_path):
            return []
            
        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        return data.get("projects", [])
