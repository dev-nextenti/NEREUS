"""
Database models for NEREUS Marine Intelligence Platform.
Compatible with PostgreSQL + PostGIS (and SQLite fallback with WKT/JSON geometry).
"""
import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class MarineObservation(Base):
    __tablename__ = "marine_observations"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    sst = Column(Float, nullable=True)                 # Sea Surface Temp in °C
    chlorophyll = Column(Float, nullable=True)         # mg/m^3
    wave_height = Column(Float, nullable=True)         # meters
    wave_period = Column(Float, nullable=True)         # seconds
    wind_speed = Column(Float, nullable=True)          # km/h
    wind_direction = Column(Float, nullable=True)      # degrees
    source = Column(String(50), default="MOSDAC/ISRO") # MOSDAC, INCOIS, NOAA, etc.
    is_demo = Column(Boolean, default=True)


class WeatherForecast(Base):
    __tablename__ = "weather_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    temperature = Column(Float, nullable=False)
    rain = Column(Float, default=0.0)                  # % or mm
    wind_speed = Column(Float, nullable=False)         # km/h
    wind_direction = Column(Float, default=0.0)        # degrees
    wave_height = Column(Float, nullable=False)        # meters
    wave_period = Column(Float, default=8.0)          # seconds
    visibility = Column(Float, default=10.0)           # km
    lightning_prob = Column(Float, default=5.0)        # %
    cyclone_risk = Column(String(20), default="NONE")  # NONE, LOW, MODERATE, HIGH
    source = Column(String(50), default="Open-Meteo")
    is_demo = Column(Boolean, default=True)


class PFZZone(Base):
    __tablename__ = "pfz_zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    geometry_json = Column(JSON, nullable=True)        # GeoJSON geometry polygon/point
    confidence = Column(Float, default=85.0)           # %
    sst = Column(Float, nullable=False)                # °C
    chlorophyll = Column(Float, nullable=False)        # mg/m^3
    depth_m = Column(Float, default=45.0)
    target_species = Column(String(200), default="Tuna, Mackerel, Sardines")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    valid_until = Column(DateTime, nullable=True)
    source = Column(String(50), default="INCOIS")
    is_demo = Column(Boolean, default=True)


class Geofence(Base):
    __tablename__ = "geofences"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)          # IMBL, EEZ, MPA, RESTRICTED, DEFENCE
    geometry_json = Column(JSON, nullable=False)       # GeoJSON LineString or Polygon
    risk_level = Column(String(20), default="CAUTION") # SAFE, CAUTION, RESTRICTED, DANGER
    description = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)


class CycloneTrack(Base):
    __tablename__ = "cyclone_tracks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    wind_speed = Column(Float, nullable=False)         # knots or km/h
    pressure = Column(Float, nullable=False)           # hPa
    category = Column(String(50), default="Depression")
    active = Column(Boolean, default=True)


class TideData(Base):
    __tablename__ = "tide_data"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(100), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    high_low = Column(String(10), default="HIGH")      # HIGH / LOW
    height = Column(Float, nullable=False)             # meters
    trend = Column(String(20), default="RISING")       # RISING / FALLING


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)          # CYCLONE, HIGH_WAVE, GEOFENCE, LIGHTNING, WIND
    severity = Column(String(20), default="INFO")      # INFO, WARNING, CRITICAL
    location = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    active = Column(Boolean, default=True)
    source = Column(String(50), default="INCOIS")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), default="default_user")
    query = Column(Text, nullable=False)
    translated_query = Column(Text, nullable=True)
    language = Column(String(20), default="en")
    response = Column(Text, nullable=False)
    response_language = Column(String(20), default="en")
    safety_verdict = Column(String(20), default="SAFE")
    agents_involved = Column(JSON, nullable=True)
    evidence_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(String(64), index=True)
    agent_name = Column(String(50), nullable=False)
    action = Column(String(100), nullable=False)
    result = Column(JSON, nullable=True)
    execution_time_ms = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(100), unique=True, nullable=False)
    api = Column(String(200), nullable=True)
    dataset = Column(String(100), nullable=False)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(20), default="CONNECTED")   # CONNECTED, CACHED, OFFLINE
    is_demo = Column(Boolean, default=True)
    records_count = Column(Integer, default=0)
