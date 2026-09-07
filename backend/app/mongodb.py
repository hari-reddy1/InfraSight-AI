"""
InfraSight AI - MongoDB Primary Database Manager
Handles connection, index lifecycle, and collection access for semi-structured monthly records.
"""

import datetime
from typing import Dict, Any, List, Optional
from app.config import settings

# Collection names as specified in the Master Architecture
COLLECTIONS = [
    "projects",
    "project_snapshots",
    "financial_snapshots",
    "schedule_snapshots",
    "progress_snapshots",
    "risk_predictions",
    "risk_explanations",
    "alerts",
    "interventions",
    "data_sources",
    "sync_runs",
    "model_versions",
    "audit_events",
    "data_quality_issues"
]


class InMemoryCollection:
    """Lightweight in-memory document collection fallback when external MongoDB daemon is offline."""
    def __init__(self, name: str):
        self.name = name
        self.docs: List[Dict[str, Any]] = []
        self._next_id = 1

    def create_index(self, keys, **kwargs):
        return f"idx_{self.name}"

    def count_documents(self, filter_query: Optional[Dict[str, Any]] = None) -> int:
        if not filter_query:
            return len(self.docs)
        return len(list(self.find(filter_query)))

    def find(self, filter_query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        filter_query = filter_query or {}
        results = []
        for d in self.docs:
            match = True
            for k, v in filter_query.items():
                if isinstance(v, dict):
                    if "$in" in v and d.get(k) not in v["$in"]:
                        match = False
                        break
                    if "$gte" in v and d.get(k, 0) < v["$gte"]:
                        match = False
                        break
                    if "$lte" in v and d.get(k, 0) > v["$lte"]:
                        match = False
                        break
                elif d.get(k) != v:
                    match = False
                    break
            if match:
                res = dict(d)
                results.append(res)
        return InMemoryCursor(results)

    def find_one(self, filter_query: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        cursor = self.find(filter_query)
        res = list(cursor)
        return res[0] if res else None

    def insert_one(self, doc: Dict[str, Any]):
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(self._next_id)
            doc_copy["id"] = self._next_id
            self._next_id += 1
        elif "id" not in doc_copy:
            doc_copy["id"] = self._next_id
            self._next_id += 1
        self.docs.append(doc_copy)
        return type("InsertResult", (), {"inserted_id": doc_copy["_id"]})()

    def insert_many(self, docs: List[Dict[str, Any]]):
        for d in docs:
            self.insert_one(d)
        return type("InsertManyResult", (), {"inserted_ids": [d.get("_id") for d in docs]})()

    def update_one(self, filter_query: Dict[str, Any], update_doc: Dict[str, Any]):
        for d in self.docs:
            match = True
            for k, v in filter_query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                if "$set" in update_doc:
                    d.update(update_doc["$set"])
                return type("UpdateResult", (), {"matched_count": 1, "modified_count": 1})()
        return type("UpdateResult", (), {"matched_count": 0, "modified_count": 0})()

    def delete_many(self, filter_query: Optional[Dict[str, Any]] = None):
        if not filter_query:
            count = len(self.docs)
            self.docs = []
            return type("DeleteResult", (), {"deleted_count": count})()
        initial_len = len(self.docs)
        self.docs = [d for d in self.docs if not all(d.get(k) == v for k, v in filter_query.items())]
        return type("DeleteResult", (), {"deleted_count": initial_len - len(self.docs)})()


class InMemoryCursor:
    def __init__(self, items: List[Dict[str, Any]]):
        self.items = items
        self._skip = 0
        self._limit = None
        self._sort_key = None
        self._sort_dir = 1

    def sort(self, key_or_list, direction=1):
        if isinstance(key_or_list, list):
            self._sort_key, self._sort_dir = key_or_list[0]
        else:
            self._sort_key = key_or_list
            self._sort_dir = direction
        self.items.sort(key=lambda x: x.get(self._sort_key, 0) if x.get(self._sort_key) is not None else 0, reverse=(self._sort_dir == -1))
        return self

    def skip(self, n: int):
        self._skip = n
        return self

    def limit(self, n: int):
        self._limit = n
        return self

    def __iter__(self):
        sliced = self.items[self._skip:]
        if self._limit is not None:
            sliced = sliced[:self._limit]
        return iter(sliced)

    def to_list(self, length: Optional[int] = None):
        sliced = self.items[self._skip:]
        if self._limit is not None:
            sliced = sliced[:self._limit]
        if length is not None:
            sliced = sliced[:length]
        return sliced


class InMemoryMongoDB:
    def __init__(self):
        self._collections: Dict[str, InMemoryCollection] = {}

    def get_collection(self, name: str) -> InMemoryCollection:
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]

    def list_collection_names(self) -> List[str]:
        return list(self._collections.keys())

    def __getitem__(self, name: str) -> InMemoryCollection:
        return self.get_collection(name)


class MongoDatabaseManager:
    """Primary MongoDB connection and collection manager."""
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        self.is_fallback = False
        self.init_connection()

    def init_connection(self):
        try:
            from pymongo import MongoClient, ASCENDING, DESCENDING
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1500)
            # Ping database to confirm live connection
            self.client.admin.command('ping')
            self.db = self.client[settings.MONGODB_DB_NAME]
            self.is_connected = True
            self.is_fallback = False
            self.setup_indexes()
            print(f"--> [MongoDB] Connected to live MongoDB instance at '{settings.MONGODB_URI}' (Database: {settings.MONGODB_DB_NAME})")
        except Exception as e:
            print(f"--> [MongoDB] Live MongoDB connection unavailable ({e}). Initializing resilient document store.")
            self.db = InMemoryMongoDB()
            self.is_connected = False
            self.is_fallback = True
            self.setup_indexes()

    def setup_indexes(self):
        """Create required indexes on collections."""
        try:
            from pymongo import ASCENDING, DESCENDING
            asc = ASCENDING
            desc = DESCENDING
        except Exception:
            asc = 1
            desc = -1

        try:
            # projects.project_code (unique)
            self.db["projects"].create_index([("project_code", asc)], unique=True)
            
            # project_snapshots compound unique: (project_code, reporting_period)
            self.db["project_snapshots"].create_index(
                [("project_code", asc), ("reporting_period", asc)],
                unique=True
            )
            # single field indexes for query performance
            self.db["project_snapshots"].create_index([("project_code", asc)])
            self.db["project_snapshots"].create_index([("reporting_period", asc)])
            self.db["project_snapshots"].create_index([("ministry", asc)])
            self.db["project_snapshots"].create_index([("sector", asc)])
            self.db["project_snapshots"].create_index([("state", asc)])

            # risk_predictions
            self.db["risk_predictions"].create_index([("project_code", asc)])
            self.db["risk_predictions"].create_index([("prediction_date", desc)])

            # alerts
            self.db["alerts"].create_index([("project_code", asc)])
            self.db["alerts"].create_index([("status", asc)])
            self.db["alerts"].create_index([("severity", asc)])

            # interventions
            self.db["interventions"].create_index([("project_id", asc)])
            self.db["interventions"].create_index([("recorded_at", desc)])

            # audit_events
            self.db["audit_events"].create_index([("timestamp", desc)])
            self.db["audit_events"].create_index([("event_type", asc)])
        except Exception as err:
            print(f"--> [MongoDB] Notice during index creation: {err}")

    def get_collection(self, name: str):
        return self.db[name]

    def get_status(self) -> Dict[str, Any]:
        return {
            "is_connected": self.is_connected,
            "is_fallback": self.is_fallback,
            "database_name": settings.MONGODB_DB_NAME,
            "uri": settings.MONGODB_URI.split("@")[-1] if "@" in settings.MONGODB_URI else settings.MONGODB_URI,
            "collections_count": len(self.db.list_collection_names()) if hasattr(self.db, "list_collection_names") else len(COLLECTIONS)
        }


mongo_manager = MongoDatabaseManager()


def get_mongo_db():
    return mongo_manager.db
