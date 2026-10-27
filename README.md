# AXIOM EMS — AI/ML-Powered Emergency Mobility

> **Smart City & Mobility · Ambulance Coordination · Route Intelligence**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=flat-square&logo=github)](https://curiouskernel.github.io/Axiom-EMS/)
[![React](https://img.shields.io/badge/React%2019-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.12-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🌐 Live Demo

**[https://curiouskernel.github.io/Axiom-EMS/](https://curiouskernel.github.io/Axiom-EMS/)**

> The demo runs entirely in-browser with a built-in simulation engine — no backend setup required to explore all features.

---

## What is AXIOM EMS?

AXIOM EMS is a Smart City & Mobility project designed to improve ambulance coordination using AI/ML, ETA prediction, and IoT-enabled checkpoint alerts.

It helps traffic personnel **anticipate ambulance arrivals**, **monitor route risks**, and **coordinate responses at upcoming intersections** through a two-stage alert workflow.

> **Our Vision:** Go beyond finding the fastest route — help make the route ready.

---

## Key Features

### 🚑 Ambulance Tracking & ETA Prediction
Real-time ambulance location tracking along pre-defined Delhi corridors. A trained Scikit-Learn ensemble model (GradientBoosting + RandomForest) estimates arrival time using distance, speed, congestion, time of day, and route conditions.

### ⚠️ Two-Stage Intersection Alert Workflow
- **Stage 1 – Approaching:** Alert issued when the ambulance enters trigger range of a checkpoint. Traffic personnel are notified to begin preparing the corridor.
- **Stage 2 – Arrived / Cleared:** Confirmed arrival at the junction triggers hold on cross-traffic; passage confirmation restores normal signal phasing and recalculates ETA for the next checkpoint.

### 📡 IoT Roadside Unit (RSU) Integration
Simulated ESP32/Arduino microcontrollers deployed at key Delhi intersections (Barakhamba Rd, Mandi House, ITO, Pragati Maidan, Ashram Chowk, AIIMS). Each unit runs a 6-state FSM with PA/TTS audio alerts, LED matrix status display, and live telemetry readouts.

### 🗺️ Congestion & Route-Risk Awareness
Dynamic congestion multipliers, roadblock injection, and risk scoring (`LOW / MODERATE / HIGH / CRITICAL`) give dispatchers a real-time picture of route hazards before the ambulance reaches them.

### 👮 Traffic Police Operations Dashboard
Dedicated command view for traffic officers with 1-click SOP actions: Acknowledge, Mark Corridor Preparing, Confirm Prepared, and Escalate Obstacle.

### 📊 Analytics & Audit Log
Full alert-to-clearance timeline, checkpoint response times, and 1-click export to CSV or JSON.

### 🔬 Interactive Simulation Lab
Pre-built evaluation scenarios (Golden Hour Emergency, Peak Rush Hour + Roadblock) with continuous playback or single-step control for testing and demonstration.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Leaflet (CartoDB Dark), Lucide React |
| **Backend** | Python 3.12, FastAPI, Scikit-Learn, Uvicorn, WebSockets |
| **ML Model** | GradientBoostingRegressor + RandomForest ensemble, Joblib serialization |
| **Hardware Sim** | ESP32 C++ firmware sketch, MQTT, Web Speech API (TTS) |

---

## Project Structure

```
Axiom-EMS/
├── frontend/           # React + Vite dashboard
│   └── src/
│       ├── components/ # All dashboard panels and views
│       ├── services/   # API client + in-browser simulation engine
│       └── types/      # TypeScript definitions
├── backend/            # FastAPI server, ML model, simulation engine
│   ├── main.py         # API endpoints and WebSocket handlers
│   ├── model.py        # ETA prediction pipeline
│   ├── iot_manager.py  # RSU state coordinator
│   └── delhi_eta_model.joblib  # Pre-trained ML model
├── hardware/           # ESP32 firmware sketch and wiring guide
├── .github/workflows/  # GitHub Actions CI/CD for GitHub Pages
├── .env.example        # Environment variable template
└── vercel.json         # Vercel deployment config
```

---

## Local Setup

### Frontend (Interactive Demo — no backend needed)
```bash
git clone https://github.com/CuriousKernel/Axiom-EMS.git
cd Axiom-EMS/frontend
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:5173`

### Backend (Full API + WebSocket Mode)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Swagger docs at `http://localhost:8000/docs`

Copy `.env.example` to `.env` and configure `VITE_API_URL` / `CORS_ORIGINS` as needed.

---

## Deployment

### GitHub Pages (auto-deploys on push to `main`)
1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push any change to `main` — the site builds and deploys automatically.

### Vercel
Import the repository at [vercel.com](https://vercel.com). The root `vercel.json` handles the build command (`cd frontend && npm install --legacy-peer-deps && npm run build`) and output directory automatically.

---

## Prototype Notice

This project is an interactive MVP prototype. Ambulance positions, sensor readings, and signal recommendations are simulated for demonstration purposes. Live traffic feeds, physical IoT integration, and external data integrations (including proposed public road-closure advisory retrieval) require further implementation and validation before production use.

---

## License

[MIT License](LICENSE) © 2026 CuriousKernel
