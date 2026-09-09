# NEREUS — Agentic Marine Intelligence & Safety Platform
> *"Ask the Ocean. Understand the Ocean. Navigate Safely."*

NEREUS is a next-generation conversational marine AI operating system and command center built specifically for Indian coastal waters, fishermen, researchers, maritime operators, and disaster management agencies.

---

## 🌟 Key Architecture

1. **Centerpiece 3D Marine Globe & NEREUS Holographic AI Core**:
   - Built with **Three.js**
   - Indian Subcontinent coastal contour rendering (Bay of Bengal, Arabian Sea, Indian Ocean)
   - Real-time animated Potential Fishing Zones (PFZs) with glowing beacons and depth contours
   - Interactive camera control, orbital rings, and dynamic AI Core states (`IDLE`, `LISTENING`, `PROCESSING`, `ANALYZING`, `WARNING`, `RESPONDING`)

2. **11 Specialized Multi-Agents with Deterministic Safety Gating**:
   - `Planner Agent`: Intent breakdown and execution plan synthesis
   - `Marine Data Agent`: ISRO MOSDAC Oceansat-3 SST and Chlorophyll-a
   - `Weather Agent`: Open-Meteo & ECMWF wind, swell, rain, and cyclone tracks
   - `Ocean Analytics Agent`: Douglas Sea Scale, swell steepness, and currents
   - `PFZ Agent`: Potential Fishing Zones with geodesic distance and pelagic species
   - `Geospatial Agent`: Shapely spatial calculations and coordinate projections
   - `Geofence Agent`: International Maritime Boundary Line (IMBL) proximity & Marine Protected Areas
   - `Navigation Agent`: Safe offshore route corridor planning avoiding surf and shoals
   - `Risk Agent`: **Deterministic safety rules engine** (AI never overrides hard capsize or storm thresholds)
   - `Visualization Agent`: Dynamic 3D globe camera choreography and layer states
   - `Explanation Agent`: Multi-step explainable evidence tree and multilingual voice scripts
   - `Reporting Agent`: Voyage safety dossiers and executive bulletins

3. **Multilingual Voice-First Interaction**:
   - Seamless speech recognition and speech synthesis
   - Supports: English, Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Malayalam, Odia, Gujarati, Bengali

4. **Real Database & PostGIS Spatial Models**:
   - PostgreSQL 15 + PostGIS 3.4 (with seamless SQLite fallback)
   - Real schema for `marine_observations`, `weather_forecasts`, `pfz_zones`, `geofences`, `cyclone_tracks`, `alerts`, `conversations`

5. **Scheduled Data Ingestion Architecture**:
   - Standalone connectors in `/backend/data_ingestion/connectors`:
     - `mosdac_connector`: ISRO satellite data
     - `incois_connector`: PFZ & Ocean State Forecast
     - `weather_connector`: Open-Meteo Marine
     - `ocean_connector`: Copernicus / NOAA currents
     - `geofence_connector`: VLIZ maritime borders

---

## 🚀 Quickstart

### Option 1: Local Development

#### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
# Backend runs at http://localhost:8000 (Swagger docs at http://localhost:8000/docs)
```

#### 2. Frontend (Vite + React + Three.js)
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

### Option 2: Full Docker Stack
```bash
docker compose up --build
```

---

## 🎙️ Demonstration Workflow

1. Open the application.
2. Watch the **Startup Diagnostic Sequence** verify database, multi-agent core, voice engine, and satellite feeds.
3. Click the **Voice Microphone** or select:
   > *"Where is the nearest Potential Fishing Zone and is it safe to go tomorrow morning?"*
4. **NEREUS CORE** enters `PROCESSING` with high-speed counter-rotating rings.
5. The 3D globe smoothly rotates and focuses onto **PFZ Zone Alpha (Off Kakinada)**.
6. The Multi-Agent pipeline computes:
   - PFZ Distance: 11.6 NM (21.4 km)
   - Wave Height: 2.4 m (exceeds small craft 2.0 m threshold)
   - Risk Verdict: `CAUTION / MODERATE RISK`
   - Deterministic Cross-Verification: Catch potential is overridden by swell height!
7. Voice response speaks the advisory in real-time.
8. Click `[SHOW EVIDENCE]` to inspect the transparent 6-step agent reasoning chain.
9. Click `[SAFE ROUTE]` to visualize the hazard-free marine passage corridor directly on the globe.
