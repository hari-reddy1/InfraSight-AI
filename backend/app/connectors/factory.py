from app.config import settings
from app.connectors.base import BaseConnector
from app.connectors.official_report import OfficialReportConnector
from app.connectors.paimana_public import PaimanaPublicConnector

def get_data_connector() -> BaseConnector:
    source = settings.DATA_SOURCE.upper()
    if source == "PAIMANA_PUBLIC":
        return PaimanaPublicConnector()
    else:
        return OfficialReportConnector()

get_connector = get_data_connector
