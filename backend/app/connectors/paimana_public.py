import requests
from typing import List, Dict, Any, Tuple
from app.connectors.base import BaseConnector
from app.config import settings

class PaimanaPublicConnector(BaseConnector):
    """
    Connector to probe official MoSPI PAIMANA public portal endpoints.
    Fails transparently if endpoint is not machine-readable or blocked by CORS/firewall.
    """
    
    def __init__(self):
        self.source_name = "PAIMANA_PUBLIC_PORTAL"
        self.base_url = settings.PAIMANA_BASE_URL
        self.reporting_period = "2026-04"

    def get_source_name(self) -> str:
        return self.source_name
        
    def get_reporting_period(self) -> str:
        return self.reporting_period
        
    def test_connection(self) -> Tuple[bool, str]:
        try:
            resp = requests.get(f"{self.base_url}/ReportPage", timeout=5, verify=False)
            if resp.status_code == 200:
                return True, f"Successfully reached official portal at {self.base_url}"
            return False, f"Official portal returned status code {resp.status_code}"
        except Exception as e:
            return False, f"PAIMANA portal unreachable: {str(e)}"
            
    def fetch_records(self) -> List[Dict[str, Any]]:
        # Does not fabricate un-documented REST endpoints.
        # Fallback cleanly to authorized machine-readable report store.
        from app.connectors.official_report import OfficialReportConnector
        return OfficialReportConnector().fetch_records()
