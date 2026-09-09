"""
Marine Data API Routes for NEREUS.
SST, Chlorophyll-a layers, and Potential Fishing Zones (PFZ).
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ...database.connection import get_db
from ...database.models import MarineObservation, PFZZone

router = APIRouter(prefix="/api/marine", tags=["Marine"])

@router.get("/sst")
def get_sst_data(lat: Optional[float] = None, lon: Optional[float] = None, db: Session = Depends(get_db)):
    obs = db.query(MarineObservation).all()
    return {
        "dataset": "ISRO MOSDAC Oceansat-3 SST",
        "units": "Celsius",
        "min_c": 23.0,
        "max_c": 32.0,
        "observations": [
            {
                "latitude": o.latitude,
                "longitude": o.longitude,
                "sst": o.sst,
                "source": o.source,
                "is_demo": o.is_demo
            }
            for o in obs
        ]
    }

@router.get("/chlorophyll")
def get_chlorophyll_data(db: Session = Depends(get_db)):
    obs = db.query(MarineObservation).all()
    return {
        "dataset": "ISRO Ocean Colour Monitor (OCM-3)",
        "units": "mg/m^3",
        "observations": [
            {
                "latitude": o.latitude,
                "longitude": o.longitude,
                "chlorophyll": o.chlorophyll,
                "source": o.source,
                "is_demo": o.is_demo
            }
            for o in obs
        ]
    }

@router.get("/pfz")
def get_pfz_zones(db: Session = Depends(get_db)):
    zones = db.query(PFZZone).all()
    return {
        "status": "SUCCESS",
        "provider": "INCOIS Marine Advisory Division",
        "total_zones": len(zones),
        "zones": [
            {
                "id": z.id,
                "name": z.zone_name,
                "latitude": z.latitude,
                "longitude": z.longitude,
                "confidence_pct": z.confidence,
                "sst_c": z.sst,
                "chlorophyll_mg_m3": z.chlorophyll,
                "depth_m": z.depth_m,
                "target_species": z.target_species,
                "source": z.source,
                "is_demo": z.is_demo
            }
            for z in zones
        ]
    }

INDIAN_COASTS_DATA = [
    {
        "id": "konkan",
        "name": "Konkan Coast",
        "states": "Maharashtra & Goa",
        "latitude": 18.922,
        "longitude": 72.834,
        "sea": "Arabian Sea (North-Central)",
        "ports": ["Mumbai Port", "JNPT", "Mormugao (Goa)", "Ratnagiri"],
        "wave_height_m": 1.4,
        "wave_period_s": 7.2,
        "sst_c": 28.6,
        "wind_speed_kmh": 14.0,
        "wind_direction": "WSW",
        "sea_state": "SLIGHT",
        "safety_verdict": "SAFE",
        "advisory": "Favorable coastal operations. Safe for mechanized trawlers and motorized craft. Minor swell.",
        "target_species": "Indian Mackerel, Bombay Duck, Pomfret, Seer Fish",
        "geofence_status": "CLEAR (Naval Security Fairway Active off Mumbai)"
    },
    {
        "id": "malabar",
        "name": "Malabar Coast",
        "states": "Kerala & Coastal Karnataka",
        "latitude": 9.931,
        "longitude": 76.267,
        "sea": "Arabian Sea (South-Central)",
        "ports": ["Cochin (Kochi)", "Mangalore", "Karwar", "Kollam", "Beypore"],
        "wave_height_m": 2.1,
        "wave_period_s": 8.4,
        "sst_c": 27.2,
        "wind_speed_kmh": 22.0,
        "wind_direction": "WNW",
        "sea_state": "MODERATE",
        "safety_verdict": "CAUTION",
        "advisory": "ELEVATED SWELL ADVISORY: Coastal upwelling active. Small motorized craft should avoid early morning offshore trips.",
        "target_species": "Oil Sardine, Indian Mackerel, Coastal Prawns, Anchovies",
        "geofence_status": "CLEAR"
    },
    {
        "id": "gujarat",
        "name": "Gujarat & Kathiawar Coast",
        "states": "Gujarat",
        "latitude": 21.641,
        "longitude": 69.629,
        "sea": "Arabian Sea (North) / Gulf of Kutch & Khambhat",
        "ports": ["Kandla (Deendayal)", "Porbandar", "Veraval", "Okha", "Pipavav"],
        "wave_height_m": 1.6,
        "wave_period_s": 7.0,
        "sst_c": 28.0,
        "wind_speed_kmh": 18.0,
        "wind_direction": "NW",
        "sea_state": "SLIGHT_MODERATE",
        "safety_verdict": "SAFE",
        "advisory": "Good marine conditions. Strong tidal bore currents in Gulf of Khambhat require navigational awareness.",
        "target_species": "Ribbonfish, Croakers, Cephalopods, Cuttlefish",
        "geofence_status": "CAUTION (Buffer Zone near Sir Creek / IMBL)"
    },
    {
        "id": "coromandel",
        "name": "Coromandel Coast",
        "states": "Tamil Nadu & Puducherry",
        "latitude": 13.082,
        "longitude": 80.270,
        "sea": "Bay of Bengal (South-West)",
        "ports": ["Chennai Port", "Ennore (Kamarajar)", "Tuticorin (V.O.C.)", "Cuddalore", "Nagapattinam"],
        "wave_height_m": 1.5,
        "wave_period_s": 7.4,
        "sst_c": 29.2,
        "wind_speed_kmh": 15.0,
        "wind_direction": "ESE",
        "sea_state": "SLIGHT",
        "safety_verdict": "SAFE",
        "advisory": "Favorable atmospheric and sea state. Normal fishing and commercial vessel traffic operating safely.",
        "target_species": "Yellowfin Tuna, Snapper, Grouper, Blue Swimming Crab",
        "geofence_status": "WARNING near Palk Strait / Sri Lanka IMBL line"
    },
    {
        "id": "andhra",
        "name": "Andhra Coast",
        "states": "Andhra Pradesh",
        "latitude": 16.989,
        "longitude": 82.247,
        "sea": "Bay of Bengal (Central-West)",
        "ports": ["Kakinada Anchorage", "Visakhapatnam", "Machilipatnam", "Krishnapatnam"],
        "wave_height_m": 2.4,
        "wave_period_s": 7.8,
        "sst_c": 28.4,
        "wind_speed_kmh": 18.5,
        "wind_direction": "SE",
        "sea_state": "MODERATE",
        "safety_verdict": "CAUTION",
        "advisory": "INCOIS HIGH WAVE BULLETIN: Swell reaches 2.4m off Godavari delta. Small craft advised to stay inshore.",
        "target_species": "Yellowfin Tuna, Seer Fish, Coastal Pelagics, Ribbonfish",
        "geofence_status": "CLEAR (Naval defence channel monitored)"
    },
    {
        "id": "odisha",
        "name": "Odisha / Utkal Coast",
        "states": "Odisha",
        "latitude": 20.316,
        "longitude": 86.611,
        "sea": "Bay of Bengal (North-West)",
        "ports": ["Paradip Port", "Dhamra Port", "Gopalpur"],
        "wave_height_m": 2.0,
        "wave_period_s": 8.0,
        "sst_c": 28.8,
        "wind_speed_kmh": 19.0,
        "wind_direction": "S",
        "sea_state": "MODERATE",
        "safety_verdict": "SAFE",
        "advisory": "Moderate sea conditions. Gahirmatha turtle breeding sanctuary geofence in strict effect.",
        "target_species": "Hilsa, Pomfret, Sciaenids, Coastal Catfish",
        "geofence_status": "RESTRICTED (Gahirmatha Marine Sanctuary Active)"
    },
    {
        "id": "bengal",
        "name": "Bengal Coast & Sundarbans",
        "states": "West Bengal",
        "latitude": 21.800,
        "longitude": 88.200,
        "sea": "Bay of Bengal (Head Bay)",
        "ports": ["Haldia", "Kolkata (Syama Prasad Mookerjee)", "Sagar Island", "Digha"],
        "wave_height_m": 1.8,
        "wave_period_s": 7.5,
        "sst_c": 29.0,
        "wind_speed_kmh": 16.0,
        "wind_direction": "S",
        "sea_state": "SLIGHT_MODERATE",
        "safety_verdict": "SAFE",
        "advisory": "Safe navigation along buoyed channels. Extreme tidal shifts and shallow mudflats in Sundarbans mouth.",
        "target_species": "Tenualosa ilisha (Hilsa), Bhetki, Tiger Prawns",
        "geofence_status": "RESTRICTED (Sundarbans UNESCO Biosphere Reserve)"
    },
    {
        "id": "andaman",
        "name": "Andaman & Nicobar Archipelago",
        "states": "Andaman & Nicobar Islands",
        "latitude": 11.623,
        "longitude": 92.726,
        "sea": "Andaman Sea / Bay of Bengal",
        "ports": ["Port Blair", "Car Nicobar", "Campbell Bay (Great Nicobar)"],
        "wave_height_m": 1.7,
        "wave_period_s": 8.2,
        "sst_c": 28.5,
        "wind_speed_kmh": 17.0,
        "wind_direction": "SW",
        "sea_state": "SLIGHT_MODERATE",
        "safety_verdict": "SAFE",
        "advisory": "Oceanic swell conditions favorable for deep-sea tuna longlining. Inter-island channels open.",
        "target_species": "Bigeye Tuna, Swordfish, Skipjack, Coral Pelagics",
        "geofence_status": "CAUTION (200 NM EEZ Maritime Limit)"
    },
    {
        "id": "lakshadweep",
        "name": "Lakshadweep Archipelago",
        "states": "Lakshadweep Islands",
        "latitude": 10.566,
        "longitude": 72.641,
        "sea": "Arabian Sea (Coral Atolls)",
        "ports": ["Kavaratti", "Agatti", "Minicoy", "Andrott"],
        "wave_height_m": 1.9,
        "wave_period_s": 8.6,
        "sst_c": 28.1,
        "wind_speed_kmh": 16.0,
        "wind_direction": "W",
        "sea_state": "MODERATE",
        "safety_verdict": "SAFE",
        "advisory": "Lagoon waters calm; outer reef ocean swell moderate. Exceptional water clarity.",
        "target_species": "Skipjack Tuna (Pole & Line), Coral Reef Species",
        "geofence_status": "PROTECTED (Coral Reef Ecologically Sensitive Zone)"
    },
    {
        "id": "kanyakumari",
        "name": "Kanyakumari Ocean Confluence",
        "states": "Tamil Nadu / Kerala Border",
        "latitude": 8.080,
        "longitude": 77.550,
        "sea": "Arabian Sea + Bay of Bengal + Indian Ocean Confluence",
        "ports": ["Kanyakumari Pier", "Colachel Harbor", "Chinnamuttom"],
        "wave_height_m": 2.5,
        "wave_period_s": 9.0,
        "sst_c": 27.9,
        "wind_speed_kmh": 24.0,
        "wind_direction": "WSW",
        "sea_state": "MODERATE_ROUGH",
        "safety_verdict": "CAUTION",
        "advisory": "STRONG CONFLUENCE CURRENTS: Significant swell and opposing tidal currents where three oceans meet. Small craft caution.",
        "target_species": "Carangids, Cuttlefish, Anchovy, Seer Fish",
        "geofence_status": "CLEAR"
    }
]

@router.get("/coasts")
def get_all_indian_coasts():
    return {
        "status": "SUCCESS",
        "total_coasts": len(INDIAN_COASTS_DATA),
        "coasts": INDIAN_COASTS_DATA
    }

