# 🚑 Axiom-EMS: Emergency Response Synchronization System

> **AI/ML & IoT-Powered Intelligent Ambulance Traffic Coordination & Green Corridor Synchronization**

[![Live Demo](https://img.shields.io/badge/Demo-Live_Deployment-brightgreen?style=for-the-badge&logo=githubpages&logoColor=white)](https://curiouskernel.github.io/Axiom-EMS/)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCuriousKernel%2FAxiom-EMS)
[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_+_Python_3.12-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn_Ensemble-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🌐 Live Deployment & Demo Links

* **Live Interactive Application**: **[https://curiouskernel.github.io/Axiom-EMS/](https://curiouskernel.github.io/Axiom-EMS/)**
* **Repository**: **[https://github.com/CuriousKernel/Axiom-EMS](https://github.com/CuriousKernel/Axiom-EMS)**

> ⚡ **Client Dual-Engine Mode**: Axiom-EMS features an integrated, high-fidelity in-browser simulation and ML inference fallback. The live demo runs 100% interactively without requiring an active local backend connection!

---

## 📌 Overview

**Axiom-EMS** is an intelligent, dual-engine emergency response platform engineered to eliminate avoidable transit delays for emergency vehicles navigating dense arterial corridors (modeled for New Delhi, India). 

By uniting **predictive Machine Learning ETA forecasting**, **roadside IoT unit (RSU) state synchronization**, and **advance traffic police coordination**, the system provisions automated, safe green corridors during critical "Golden Hour" transits.

---

## ✨ Key Capabilities

| Capability | Description |
| :--- | :--- |
| 🚨 **2-Stage Advance Alert Workflow** | Stage 1 pre-clears junctions at dynamic lead distances ($<650\text{ m}$); Stage 2 detects junction threshold arrival ($<50\text{ m}$) and passage confirmation to restore normal traffic phasing. |
| 🤖 **AI/ML ETA Prediction Engine** | GradientBoostingRegressor + RandomForest ensemble trained on real corridor dynamics, congestion multipliers ($1.0\times - 3.5\times$), weather/smog, and rush-hour patterns ($R^2 = 0.9891$, $86.4\%$ improvement over naive baselines). |
| 📡 **Roadside IoT Units (RSU)** | Simulates ESP32/C++ microcontrollers across key intersections (*Barakhamba, Mandi House, ITO, Pragati Maidan, Ashram Chowk, AIIMS*) with 6-state FSM, PA TTS audio alerts, and LED matrix feeds. |
| 👮 **Traffic Police Operations Desk** | Tactical dashboard for real-time corridor monitoring, 1-click SOP actions (*Acknowledge*, *Mark Preparing*, *Confirm Prepared*, *Escalate Obstacle*). |
| 🧪 **Interactive Simulation Lab** | Pre-configured evaluation scenarios (Golden Hour emergency run, peak rush-hour gridlock, roadblock injections) with continuous playback or single-step stepping. |
| 📊 **Audit & Telemetry Export** | Comprehensive transit history, checkpoint arrival times, clearance intervals, and 1-click CSV/JSON export. |

---

## 🏗️ Architecture

```
                       [ Emergency Ambulance GPS / Telemetry ]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │      Axiom-EMS Dual Engine Core       │
                     │ (FastAPI REST/WS  or  Client Fallback)│
                     └───────────────────┬───────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          ▼                              ▼                              ▼
  [ Scikit-Learn ML ]            [ IoT RSU Network ]          [ Traffic Police Desk ]
  • Gradient Boosting            • 6-State FSM (IDLE to RESET) • Advance Alert Queue
  • 90% Confidence Bounds        • Web Speech Audio / PA       • 1-Click SOP Actions
  • Dynamic Lead Distance        • ESP32 MQTT/REST Telemetry   • Corridor Clearance
          │                              │                              │
          └──────────────────────────────┼──────────────────────────────┘
                                         ▼
                     [ Interactive Leaflet Dashboard ]
                     (Dark Mode, Tailwind CSS, Lucide Icons)
```

---

## 📂 Repository Structure

```tree
Axiom-EMS/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD pipeline
├── backend/
│   ├── delhi_eta_model.joblib  # Pre-trained Scikit-Learn ML model
│   ├── model_metadata.joblib   # ML model metrics & evaluation weights
│   ├── iot_manager.py          # Roadside Unit (RSU) state coordinator
│   ├── model.py                # ML prediction pipeline & feature transforms
│   ├── routes_data.py          # Corridor GPS waypoints & checkpoint definitions
│   ├── simulation_engine.py    # Ambulance movement & scenario generator
│   ├── main.py                 # FastAPI application endpoints & WebSockets
│   └── requirements.txt        # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # Dashboard, Simulation Lab, Tracking, Police Desk
│   │   ├── services/api.ts     # Client dual-engine & fallback simulator
│   │   ├── types/index.ts      # TypeScript definitions
│   │   ├── App.tsx             # Main application layout
│   │   └── main.tsx            # React entry point
│   ├── package.json            # Frontend dependencies & scripts
│   ├── vite.config.ts          # Vite build configuration (base path configured)
│   └── tailwind.config.js      # Styling design tokens
├── hardware/
│   ├── esp32_rsu_node.ino      # C++ firmware sketch for ESP32 roadside nodes
│   └── README.md               # Hardware wiring, MQTT payloads & pinout guide
├── .env.example                # Template for environment configuration
├── .gitignore                  # Production Git ignore rules
├── package.json                # Root package configuration
├── vercel.json                 # Vercel deployment configuration
└── README.md                   # Project documentation
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/CuriousKernel/Axiom-EMS.git
cd Axiom-EMS
```

### 2. Frontend Setup (Interactive Dashboard)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Backend Setup (Optional for Full API/WebSocket Mode)
```bash
cd ../backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger documentation is available at **`http://localhost:8000/docs`**.

---

## 🚢 Deployment Guide

### Option 1: GitHub Pages (Automated via Actions)
This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main` branch; the site will be automatically deployed to:
   `https://curiouskernel.github.io/Axiom-EMS/`

### Option 2: Vercel (1-Click Deployment)
1. Import this repository in [Vercel](https://vercel.com).
2. The root `vercel.json` automatically detects the build command and directory (`frontend/dist`).
3. Click **Deploy**.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Leaflet & CartoDB Dark Matter.
- **Backend**: Python 3.12, FastAPI, Scikit-Learn, NumPy, Joblib, Uvicorn, WebSockets.
- **Hardware Simulation**: ESP32 C++ Arduino firmware, MQTT protocol, Web Speech API (TTS).

---

## 📄 License & Safety Notice

This project is licensed under the [MIT License](LICENSE).

*Notice: Axiom-EMS is an interactive operational prototype designed for demonstration and research. Traffic signal preemption actions in live deployments require authorized Delhi Traffic Police SOP clearance and fail-safe hardware interlocks.*
