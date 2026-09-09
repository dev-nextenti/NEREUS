"""
Weather and Cyclone API Routes for NEREUS.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...database.connection import get_db
from ...database.models import WeatherForecast, CycloneTrack

router = APIRouter(prefix="/api", tags=["Weather & Atmosphere"])

@router.get("/weather")
def get_weather(db: Session = Depends(get_db)):
    forecasts = db.query(WeatherForecast).all()
    return {
        "provider": "Open-Meteo ECMWF High-Res Marine",
        "count": len(forecasts),
        "forecasts": [
            {
                "latitude": f.latitude,
                "longitude": f.longitude,
                "temperature": f.temperature,
                "wind_speed_kmh": f.wind_speed,
                "wind_direction": f.wind_direction,
                "wave_height_m": f.wave_height,
                "wave_period_s": f.wave_period,
                "rain_prob_pct": f.rain,
                "visibility_km": f.visibility,
                "lightning_prob_pct": f.lightning_prob,
                "cyclone_risk": f.cyclone_risk,
                "source": f.source,
                "is_demo": f.is_demo
            }
            for f in forecasts
        ]
    }

@router.get("/cyclones")
def get_cyclones(db: Session = Depends(get_db)):
    tracks = db.query(CycloneTrack).all()
    return {
        "provider": "IMD Regional Specialized Meteorological Centre",
        "active_tracks": [
            {
                "id": c.id,
                "name": c.name,
                "latitude": c.latitude,
                "longitude": c.longitude,
                "wind_speed_kmh": c.wind_speed,
                "pressure_hpa": c.pressure,
                "category": c.category,
                "active": c.active
            }
            for c in tracks
        ]
    }

WMO_WEATHER_CODES = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow Fall",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Heavy Hail"
}

KNOWN_INDIAN_LOCATIONS = [
    {"name": "Mumbai, Maharashtra", "lat": 18.922, "lon": 72.834, "type": "coastal_port"},
    {"name": "Kakinada, Andhra Pradesh", "lat": 16.989, "lon": 82.247, "type": "coastal_port"},
    {"name": "Visakhapatnam, Andhra Pradesh", "lat": 17.686, "lon": 83.218, "type": "coastal_port"},
    {"name": "Chennai, Tamil Nadu", "lat": 13.082, "lon": 80.270, "type": "coastal_port"},
    {"name": "Kochi, Kerala", "lat": 9.931, "lon": 76.267, "type": "coastal_port"},
    {"name": "New Delhi, NCR", "lat": 28.613, "lon": 77.209, "type": "inland_capital"},
    {"name": "Bengaluru, Karnataka", "lat": 12.971, "lon": 77.594, "type": "inland_tech"},
    {"name": "Hyderabad, Telangana", "lat": 17.385, "lon": 78.486, "type": "inland_plateau"},
    {"name": "Kolkata, West Bengal", "lat": 22.572, "lon": 88.363, "type": "coastal_delta"},
    {"name": "Ahmedabad, Gujarat", "lat": 23.022, "lon": 72.571, "type": "inland_west"},
    {"name": "Goa (Panaji)", "lat": 15.498, "lon": 73.827, "type": "coastal_harbor"},
    {"name": "Mangalore, Karnataka", "lat": 12.914, "lon": 74.856, "type": "coastal_port"},
    {"name": "Porbandar, Gujarat", "lat": 21.641, "lon": 69.629, "type": "coastal_port"},
    {"name": "Paradip, Odisha", "lat": 20.316, "lon": 86.611, "type": "coastal_port"},
    {"name": "Rameswaram, Tamil Nadu", "lat": 9.287, "lon": 79.312, "type": "coastal_strait"},
    {"name": "Port Blair, Andaman & Nicobar", "lat": 11.623, "lon": 92.726, "type": "island_territory"},
    {"name": "Kavaratti, Lakshadweep", "lat": 10.566, "lon": 72.641, "type": "island_territory"},
    {"name": "Jaipur, Rajasthan", "lat": 26.912, "lon": 75.787, "type": "inland_arid"},
    {"name": "Lucknow, Uttar Pradesh", "lat": 26.846, "lon": 80.946, "type": "inland_plains"},
    {"name": "Patna, Bihar", "lat": 25.594, "lon": 85.137, "type": "inland_gangetic"},
    {"name": "Bhopal, Madhya Pradesh", "lat": 23.259, "lon": 77.412, "type": "inland_central"},
    {"name": "Guwahati, Assam", "lat": 26.144, "lon": 91.736, "type": "northeast_riverine"},
    {"name": "Srinagar, Jammu & Kashmir", "lat": 34.083, "lon": 74.797, "type": "himalayan_valley"},
    {"name": "Shimla, Himachal Pradesh", "lat": 31.104, "lon": 77.173, "type": "himalayan_ridge"}
]

@router.get("/weather/point")
def get_point_climate(lat: float, lon: float):
    import requests, math

    # 1. Reverse geocode / identify closest Indian territory
    closest_loc = None
    min_dist_km = 9999.0
    for loc in KNOWN_INDIAN_LOCATIONS:
        # Haversine distance
        dlat = math.radians(loc["lat"] - lat)
        dlon = math.radians(loc["lon"] - lon)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat)) * math.cos(math.radians(loc["lat"])) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        dist = 6371.0 * c
        if dist < min_dist_km:
            min_dist_km = dist
            closest_loc = loc

    if min_dist_km < 40:
        place_label = closest_loc["name"]
        region_type = closest_loc["type"]
    elif min_dist_km < 250:
        place_label = f"Near {closest_loc['name']} ({round(min_dist_km, 1)} km away)"
        region_type = closest_loc["type"]
    else:
        # Determine geographic sea/land quadrant across Indian region
        if 8.0 <= lat <= 22.0 and 80.0 <= lon <= 95.0:
            place_label = "Bay of Bengal Marine Sector"
            region_type = "open_sea"
        elif 8.0 <= lat <= 24.0 and 65.0 <= lon <= 77.0:
            place_label = "Arabian Sea Offshore Sector"
            region_type = "open_sea"
        elif lat < 8.0:
            place_label = "Equatorial Indian Ocean"
            region_type = "deep_ocean"
        elif 20.0 <= lat <= 36.0 and 68.0 <= lon <= 97.0:
            place_label = "Northern / Central Indian Mainland"
            region_type = "inland_mainland"
        else:
            place_label = f"Indian Oceanic Coordinate ({round(lat, 3)}°N, {round(lon, 3)}°E)"
            region_type = "general"

    # 2. Query Live Open-Meteo Weather API
    temp = 28.0
    humidity = 70
    wind_kmh = 16.0
    wind_dir = 135.0
    weather_desc = "Partly Cloudy"
    pressure = 1010.0
    rain_mm = 0.0
    is_live = False

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=Asia%2FKolkata"
        res = requests.get(url, timeout=3.5)
        if res.status_code == 200:
            data = res.json()
            curr = data.get("current", {})
            temp = curr.get("temperature_2m", temp)
            humidity = curr.get("relative_humidity_2m", humidity)
            wind_kmh = curr.get("wind_speed_10m", wind_kmh)
            wind_dir = curr.get("wind_direction_10m", wind_dir)
            rain_mm = curr.get("rain", 0.0)
            code = curr.get("weather_code", 2)
            weather_desc = WMO_WEATHER_CODES.get(code, "Partly Cloudy")
            pressure = curr.get("surface_pressure", pressure)
            is_live = True
    except Exception:
        pass

    # 3. Check Marine / Coastal Wave conditions if sea or coastal
    is_marine = "sea" in region_type or "ocean" in region_type or "coastal" in region_type or "island" in region_type
    wave_height_m = 1.4
    wave_period_s = 7.5
    sea_state = "MODERATE"
    if is_marine:
        try:
            m_url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}&current=wave_height,wave_period,wave_direction&timezone=Asia%2FKolkata"
            m_res = requests.get(m_url, timeout=3.0)
            if m_res.status_code == 200:
                m_curr = m_res.json().get("current", {})
                if m_curr.get("wave_height") is not None:
                    wave_height_m = m_curr.get("wave_height", wave_height_m)
                    wave_period_s = m_curr.get("wave_period", wave_period_s)
        except Exception:
            pass

        if wave_height_m < 0.8: sea_state = "CALM"
        elif wave_height_m < 1.5: sea_state = "SLIGHT"
        elif wave_height_m < 2.5: sea_state = "MODERATE"
        elif wave_height_m < 3.5: sea_state = "ROUGH"
        else: sea_state = "VERY_ROUGH"

    # 4. Safety classification
    if wave_height_m >= 3.0 or wind_kmh >= 40.0:
        verdict = "DANGER"
        advisory = "EXTREME CAUTION: Sea conditions exceed small vessel operating threshold. High risk of vessel instability."
    elif wave_height_m >= 2.0 or wind_kmh >= 25.0 or "Thunderstorm" in weather_desc:
        verdict = "CAUTION"
        advisory = "ELEVATED SWELL / WIND: Fishing and outdoor marine activities should be limited to large motorized craft."
    else:
        verdict = "SAFE"
        advisory = "OPTIMAL CLIMATE: Favorable atmospheric and sea state conditions for coastal navigation and general operations."

    # Wind direction to compass
    dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    comp_dir = dirs[int((wind_dir + 11.25) / 22.5) % 16]

    return {
        "status": "SUCCESS",
        "pinpoint": {
            "latitude": round(lat, 4),
            "longitude": round(lon, 4),
            "location_name": place_label,
            "region_type": region_type,
            "is_coastal_marine": is_marine
        },
        "climate": {
            "temperature_c": round(temp, 1),
            "weather_condition": weather_desc,
            "relative_humidity_pct": round(humidity, 0),
            "wind_speed_kmh": round(wind_kmh, 1),
            "wind_direction_deg": round(wind_dir, 0),
            "wind_compass": comp_dir,
            "precipitation_mm": round(rain_mm, 1),
            "surface_pressure_hpa": round(pressure, 1),
            "is_live_data": is_live
        },
        "marine": {
            "is_marine": is_marine,
            "wave_height_m": round(wave_height_m, 1) if is_marine else None,
            "wave_period_s": round(wave_period_s, 1) if is_marine else None,
            "sea_state": sea_state if is_marine else "N/A (Inland)",
            "sst_c": round(temp - 0.5, 1) if is_marine else None,
            "pfz_biomass_suitability": "FAVORABLE" if is_marine and temp >= 26.5 else "LOW"
        },
        "safety": {
            "verdict": verdict,
            "advisory": advisory
        }
    }

