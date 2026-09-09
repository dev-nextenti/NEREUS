"""
Base Connector Interface for NEREUS Data Ingestion Architecture.
Implements: FETCH -> VALIDATE -> NORMALIZE -> TRANSFORM -> STORE -> LOG.
Includes clean DEMO vs LIVE switching without pretending fake data is live.
"""
from abc import ABC, abstractmethod
import os
import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ...database.models import DataSource

class BaseConnector(ABC):
    def __init__(self, source_name: str, dataset: str, api_url: str = None):
        self.source_name = source_name
        self.dataset = dataset
        self.api_url = api_url
        self.is_live = os.getenv(f"{source_name.upper()}_LIVE", "false").lower() == "true"

    @abstractmethod
    def fetch(self) -> Any:
        """Fetch raw data from upstream API or fallback provider."""
        pass

    @abstractmethod
    def validate(self, raw_data: Any) -> bool:
        """Validate payload schema and completeness."""
        pass

    @abstractmethod
    def normalize(self, raw_data: Any) -> List[Dict[str, Any]]:
        """Convert vendor-specific formats to standard NEREUS schema."""
        pass

    @abstractmethod
    def store(self, db: Session, normalized_records: List[Dict[str, Any]]) -> int:
        """Store or upsert records in the database."""
        pass

    def log(self, db: Session, status: str, count: int):
        """Update DataSource health and last update time."""
        ds = db.query(DataSource).filter(DataSource.source_name == self.source_name).first()
        if not ds:
            ds = DataSource(
                source_name=self.source_name,
                api=self.api_url,
                dataset=self.dataset,
                status=status,
                is_demo=not self.is_live,
                records_count=count,
                last_updated=datetime.datetime.utcnow()
            )
            db.add(ds)
        else:
            ds.status = status
            ds.records_count = (ds.records_count or 0) + count
            ds.last_updated = datetime.datetime.utcnow()
            ds.is_demo = not self.is_live
        db.commit()

    def run_pipeline(self, db: Session) -> Dict[str, Any]:
        """Execute complete ingestion pipeline."""
        start_time = datetime.datetime.utcnow()
        try:
            raw = self.fetch()
            if not self.validate(raw):
                self.log(db, "VALIDATION_FAILED", 0)
                return {"status": "error", "error": "Validation failed"}
            normalized = self.normalize(raw)
            count = self.store(db, normalized)
            status = "CONNECTED" if self.is_live else "DEMO_ACTIVE"
            self.log(db, status, count)
            return {
                "source": self.source_name,
                "status": status,
                "mode": "LIVE" if self.is_live else "DEMO",
                "ingested_records": count,
                "duration_ms": (datetime.datetime.utcnow() - start_time).total_seconds() * 1000
            }
        except Exception as e:
            self.log(db, "ERROR", 0)
            return {"source": self.source_name, "status": "ERROR", "error": str(e)}
