from abc import ABC, abstractmethod
from typing import List, Dict, Any, Tuple

class BaseConnector(ABC):
    @abstractmethod
    def get_source_name(self) -> str:
        pass
        
    @abstractmethod
    def test_connection(self) -> Tuple[bool, str]:
        """Returns (is_connected, status_message)"""
        pass
        
    @abstractmethod
    def fetch_records(self) -> List[Dict[str, Any]]:
        """Returns list of raw project records conforming to CUF schema"""
        pass
        
    @abstractmethod
    def get_reporting_period(self) -> str:
        """Returns period string e.g. 2026-04"""
        pass

    def fetch_all_projects(self) -> List[Dict[str, Any]]:
        """Convenience alias for fetch_records"""
        return self.fetch_records()
