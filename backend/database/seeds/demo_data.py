"""
Seed script for NEREUS: Realistic Indian coastal marine data.
Includes Bay of Bengal, Arabian Sea, Kakinada, Chennai, Visakhapatnam, Kochi, Mumbai.
"""
import datetime
from sqlalchemy.orm import Session
from ..models import (
    MarineObservation, WeatherForecast, PFZZone,
    Geofence, CycloneTrack, TideData, Alert, DataSource
)

def seed_all_demo_data(db: Session):
    # Check if already seeded
    if db.query(DataSource).first():
        print("[SEED] Database already populated with seed data.")
        return

    print("[SEED] Seeding realistic Indian coastal marine data...")

    # 1. Data Sources Status
    sources = [
        DataSource(source_name="MOSDAC/ISRO", api="https://mosdac.gov.in/api/sst", dataset="Oceansat-3 / INSAT-3D SST & Chlorophyll", status="CONNECTED", is_demo=True, records_count=124800),
        DataSource(source_name="INCOIS", api="https://incois.gov.in/marine/pfz", dataset="Potential Fishing Zones & Ocean State Forecast", status="CONNECTED", is_demo=True, records_count=842),
        DataSource(source_name="Open-Meteo Marine", api="https://marine-api.open-meteo.com/v1/marine", dataset="ECMWF High-Res Wave & Wind Forecast", status="CONNECTED", is_demo=True, records_count=52100),
        DataSource(source_name="Copernicus/NOAA", api="https://ocean.copernicus.eu", dataset="Global Ocean Physical Reanalysis & Currents", status="CONNECTED", is_demo=True, records_count=39400),
        DataSource(source_name="VLIZ Maritime", api="https://marineregions.org", dataset="IMBL, EEZ & Marine Protected Areas", status="CONNECTED", is_demo=True, records_count=48),
        DataSource(source_name="PostGIS Engine", api="internal://spatial", dataset="Spatial Indexes & Distance Calculations", status="CONNECTED", is_demo=True, records_count=15300),
        DataSource(source_name="AI Multi-Agents", api="langgraph://nereus-core", dataset="Planner, Weather, PFZ, Geo, Risk, Explainer", status="CONNECTED", is_demo=True, records_count=11),
    ]
    db.add_all(sources)

    # 2. Potential Fishing Zones (PFZs)
    # Realistic spots off Andhra Pradesh (Kakinada / Vizag), Tamil Nadu (Chennai), Kerala (Kochi)
    pfz_list = [
        PFZZone(
            zone_name="PFZ Zone Alpha (Off Kakinada)",
            latitude=16.942,
            longitude=82.385,
            confidence=89.5,
            sst=28.2,
            chlorophyll=1.95,
            depth_m=42.0,
            target_species="Yellowfin Tuna, Ribbonfish, Sardines",
            source="INCOIS",
            is_demo=True,
            geometry_json={"type": "Point", "coordinates": [82.385, 16.942]}
        ),
        PFZZone(
            zone_name="PFZ Zone Bravo (Godavari Plume Front)",
            latitude=16.680,
            longitude=82.520,
            confidence=92.0,
            sst=27.8,
            chlorophyll=2.40,
            depth_m=55.0,
            target_species="Mackerel, Seer Fish, Coastal Pelagics",
            source="INCOIS / MOSDAC",
            is_demo=True,
            geometry_json={"type": "Point", "coordinates": [82.520, 16.680]}
        ),
        PFZZone(
            zone_name="PFZ Zone Charlie (Vizag Offshore Thermal Eddy)",
            latitude=17.550,
            longitude=83.480,
            confidence=84.0,
            sst=28.5,
            chlorophyll=1.65,
            depth_m=68.0,
            target_species="Skipjack Tuna, Carangids, Squids",
            source="INCOIS",
            is_demo=True,
            geometry_json={"type": "Point", "coordinates": [83.480, 17.550]}
        ),
        PFZZone(
            zone_name="PFZ Zone Delta (Off Chennai Coast)",
            latitude=13.120,
            longitude=80.390,
            confidence=78.5,
            sst=29.1,
            chlorophyll=1.35,
            depth_m=38.0,
            target_species="Indian Mackerel, Anchovies",
            source="INCOIS",
            is_demo=True,
            geometry_json={"type": "Point", "coordinates": [80.390, 13.120]}
        ),
        PFZZone(
            zone_name="PFZ Zone Echo (Kochi Upwelling Zone)",
            latitude=9.880,
            longitude=76.120,
            confidence=94.0,
            sst=26.8,
            chlorophyll=3.10,
            depth_m=50.0,
            target_species="Oil Sardine, Indian Mackerel, Prawns",
            source="INCOIS / MOSDAC",
            is_demo=True,
            geometry_json={"type": "Point", "coordinates": [76.120, 9.880]}
        )
    ]
    db.add_all(pfz_list)

    # 3. Weather Forecasts
    weather_list = [
        WeatherForecast(
            latitude=16.989, longitude=82.247, # Kakinada
            temperature=28.4, rain=35.0, wind_speed=18.5, wind_direction=140.0,
            wave_height=2.3, wave_period=7.8, visibility=8.5, lightning_prob=15.0,
            cyclone_risk="LOW", source="Open-Meteo ECMWF", is_demo=True
        ),
        WeatherForecast(
            latitude=17.686, longitude=83.218, # Visakhapatnam
            temperature=29.1, rain=20.0, wind_speed=16.0, wind_direction=130.0,
            wave_height=1.8, wave_period=8.2, visibility=9.5, lightning_prob=10.0,
            cyclone_risk="NONE", source="Open-Meteo ECMWF", is_demo=True
        ),
        WeatherForecast(
            latitude=13.082, longitude=80.270, # Chennai
            temperature=30.2, rain=10.0, wind_speed=14.0, wind_direction=110.0,
            wave_height=1.4, wave_period=7.0, visibility=10.0, lightning_prob=5.0,
            cyclone_risk="NONE", source="Open-Meteo ECMWF", is_demo=True
        ),
        WeatherForecast(
            latitude=9.931, longitude=76.267, # Kochi
            temperature=27.5, rain=65.0, wind_speed=24.0, wind_direction=240.0,
            wave_height=3.1, wave_period=9.5, visibility=6.0, lightning_prob=45.0,
            cyclone_risk="MODERATE", source="Open-Meteo ECMWF", is_demo=True
        )
    ]
    db.add_all(weather_list)

    # 4. Marine Observations (SST / Chlorophyll grid)
    obs_list = [
        MarineObservation(latitude=16.95, longitude=82.35, sst=28.3, chlorophyll=1.92, wave_height=2.2, wave_period=7.6, wind_speed=17.8, wind_direction=135.0, source="MOSDAC/ISRO", is_demo=True),
        MarineObservation(latitude=16.70, longitude=82.50, sst=27.9, chlorophyll=2.35, wave_height=2.4, wave_period=8.0, wind_speed=19.2, wind_direction=140.0, source="MOSDAC/ISRO", is_demo=True),
        MarineObservation(latitude=17.50, longitude=83.45, sst=28.6, chlorophyll=1.60, wave_height=1.9, wave_period=8.1, wind_speed=15.5, wind_direction=125.0, source="MOSDAC/ISRO", is_demo=True),
        MarineObservation(latitude=13.10, longitude=80.35, sst=29.2, chlorophyll=1.38, wave_height=1.5, wave_period=7.2, wind_speed=13.8, wind_direction=115.0, source="MOSDAC/ISRO", is_demo=True),
        MarineObservation(latitude=9.90, longitude=76.15, sst=26.9, chlorophyll=3.05, wave_height=3.0, wave_period=9.4, wind_speed=23.5, wind_direction=245.0, source="MOSDAC/ISRO", is_demo=True),
    ]
    db.add_all(obs_list)

    # 5. Geofences
    geofences = [
        Geofence(
            name="India - Sri Lanka IMBL (Palk Strait)",
            type="IMBL",
            risk_level="DANGER",
            description="International Maritime Boundary Line between India and Sri Lanka. Crossing triggers high risk of vessel detention.",
            geometry_json={
                "type": "LineString",
                "coordinates": [
                    [79.833, 9.100],
                    [79.883, 9.400],
                    [79.950, 9.700],
                    [80.050, 10.050],
                    [80.200, 10.350]
                ]
            }
        ),
        Geofence(
            name="Gulf of Mannar Marine Biosphere Reserve",
            type="MPA",
            risk_level="RESTRICTED",
            description="Ecologically sensitive coral reef ecosystem and dugong habitat. Commercial trawling strictly prohibited.",
            geometry_json={
                "type": "Polygon",
                "coordinates": [[
                    [78.80, 8.80],
                    [79.30, 8.80],
                    [79.35, 9.25],
                    [78.90, 9.25],
                    [78.80, 8.80]
                ]]
            }
        ),
        Geofence(
            name="Indian EEZ Eastern Boundary Sector",
            type="EEZ",
            risk_level="CAUTION",
            description="200 Nautical Mile Exclusive Economic Zone boundary limit in the Bay of Bengal.",
            geometry_json={
                "type": "LineString",
                "coordinates": [
                    [85.00, 10.00],
                    [86.50, 13.00],
                    [87.20, 16.00],
                    [88.00, 19.00]
                ]
            }
        ),
        Geofence(
            name="Visakhapatnam Naval Defence Channel",
            type="RESTRICTED",
            risk_level="DANGER",
            description="Indian Navy restricted security fairway. Unauthorized fishing craft prohibited.",
            geometry_json={
                "type": "Polygon",
                "coordinates": [[
                    [83.25, 17.65],
                    [83.35, 17.65],
                    [83.35, 17.72],
                    [83.25, 17.72],
                    [83.25, 17.65]
                ]]
            }
        )
    ]
    db.add_all(geofences)

    # 6. Cyclone Tracks (Active/Historical monitoring)
    cyclones = [
        CycloneTrack(
            name="Depression BOB-02 (Bay of Bengal)",
            latitude=15.20,
            longitude=85.80,
            wind_speed=55.0, # km/h
            pressure=1002.0, # hPa
            category="Deep Depression",
            active=True
        )
    ]
    db.add_all(cyclones)

    # 7. Tide Data
    tides = [
        TideData(location="Kakinada Port", high_low="HIGH", height=1.65, trend="RISING"),
        TideData(location="Visakhapatnam Harbor", high_low="HIGH", height=1.82, trend="RISING"),
        TideData(location="Chennai Harbor", high_low="LOW", height=0.45, trend="FALLING"),
        TideData(location="Kochi Oil Terminal", high_low="HIGH", height=1.20, trend="SLACK"),
    ]
    db.add_all(tides)

    # 8. Active Alerts
    alerts = [
        Alert(
            type="HIGH_WAVE",
            severity="WARNING",
            location="Andhra Pradesh Offshore (Kakinada to Machilipatnam)",
            latitude=16.85, longitude=82.40,
            message="INCOIS High Wave Alert: Swell wave heights between 2.2m to 2.8m expected during early morning hours. Small craft advisory in effect.",
            active=True,
            source="INCOIS OSF"
        ),
        Alert(
            type="GEOFENCE",
            severity="CRITICAL",
            location="Palk Bay / Rameswaram Sector",
            latitude=9.28, longitude=79.31,
            message="GEOFENCE PROXIMITY ALERT: 4 fishing vessels operating within 2.5 NM of the International Maritime Boundary Line. Return to Indian waters advised.",
            active=True,
            source="VLIZ / Coastal Guard"
        ),
        Alert(
            type="CYCLONE",
            severity="INFO",
            location="Central Bay of Bengal",
            latitude=15.20, longitude=85.80,
            message="IMD Bulletin: Well-marked low pressure area concentrated into Depression BOB-02 moving North-Northwestwards.",
            active=True,
            source="IMD / MOSDAC"
        ),
        Alert(
            type="LIGHTNING",
            severity="WARNING",
            location="Kerala South Offshore (Kochi to Alappuzha)",
            latitude=9.80, longitude=76.20,
            message="Thunderstorm with frequent cloud-to-surface lightning strikes detected over coastal waters. Fishermen advised to seek harbor.",
            active=True,
            source="Open-Meteo Lightning Sensor"
        )
    ]
    db.add_all(alerts)

    db.commit()
    print("[SEED] Successfully seeded all marine intelligence data!")
