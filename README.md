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

### Option 1: Deploy through GitHub (Cloud & Production)

NEREUS is fully containerized and includes native CI/CD workflows and 1-click cloud blueprints for instant deployment straight from GitHub.

#### 1. Push Code to your GitHub Repository
```bash
# Initialize and rename default branch to main
git branch -M main

# Link your GitHub repository
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

# Push to GitHub
git push -u origin main
```

#### 2. 1-Click Deploy on Render.com (Recommended)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
1. Go to [Render.com Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
2. Connect your GitHub repository.
3. Render automatically detects [`render.yaml`](render.yaml) and builds the multi-stage Docker container.
4. Under **Environment Variables**, set:
   - `GEMINI_API_KEY`: Your Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/)).
5. Click **Apply**. Your app is immediately live on a global `https://<service-name>.onrender.com` URL with automatic HTTPS and zero CORS configuration!

#### 3. Deploy on Railway.app
1. Go to [Railway.app](https://railway.app/) -> **New Project** -> **Deploy from GitHub repo**.
2. Select your repository. Railway automatically detects [`railway.json`](railway.json) and [`Dockerfile`](Dockerfile).
3. In **Variables**, add `GEMINI_API_KEY`.
4. Generate a public domain under **Settings** -> **Networking**.

#### 4. Automated GitHub Actions CI/CD
On every `git push` to `main`, the [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) pipeline automatically:
- Validates and builds the React frontend production bundle.
- Runs Python backend smoke tests.
- Builds and packages the production Docker container into **GitHub Container Registry (`ghcr.io`)**.

---

### Option 2: Local Development

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

### Option 3: Full Docker Stack
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
