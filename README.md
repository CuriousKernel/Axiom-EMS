# EMS — Emergency Medical Service Corridor System - Delhi Traffic Police
### AI/ML + IoT-Based Intelligent Ambulance Traffic Coordination for Delhi, India

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=flat-square&logo=github)](https://curiouskernel.github.io/Axiom-EMS/)
[![React](https://img.shields.io/badge/React%2019-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.12-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> **Our Vision:** Go beyond finding the fastest route — help make the route ready.

---

## 🌐 Live Interactive Application

### 🚀 **[https://curiouskernel.github.io/Axiom-EMS/](https://curiouskernel.github.io/Axiom-EMS/)**

*(Client Dual-Engine Mode: The web application includes an integrated client-side simulation engine with full Scikit-ensemble ML inference fallback, so 100% of the interactive features, map tracking, and IoT controls work out-of-the-box in your browser!)*

---

## 1. Problem Statement

Ambulances in Delhi experience severe delays due to arterial congestion, uncoordinated signal cycles, roadblock bottlenecks, and disconnected communication between ambulance drivers and traffic authorities.

**EMS (Emergency Medical Service Corridor System - Delhi Traffic Police)** is an operational emergency response command platform designed to coordinate arterial corridors and eliminate avoidable delays during critical "Golden Hour" transit.

The system delivers two critical notifications:
1. **Ambulance Approaching (Stage 1)**: Notifies the relevant intersection in advance, calculating dynamic predicted arrival time, distance to threshold, and recommended traffic-management actions with localized horn speaker announcements.
2. **Ambulance Arrived / Passed (Stage 2)**: Confirms arrival at checkpoint (<50m), holds conflicting cross-traffic, logs the timestamp, restores standard cycle phasing once passed, and coordinates the next downstream checkpoint.

---

## 2. Core Architecture & Modules

```
                           [ Ambulance GPS / Simulated Telemetry ]
                                             │
                                             ▼
                            [ FastAPI / Client Dual Engine ]
                                             │
                ┌────────────────────────────┼────────────────────────────┐
                ▼                            ▼                            ▼
    [ Scikit-Learn ML Model ]       [ IoT RSU State Machine ]     [ Traffic Police Console ]
      - Gradient Boosting              - 6 States: IDLE to RESET    - Advance Advisories
      - 90% Uncertainty Bounds         - PA Speaker TTS             - 1-Click SOP Actions
      - Dynamic Lead Calculation       - Simulated Queue Radar      - Passage Audit
                │                            │                            │
                └────────────────────────────┼────────────────────────────┘
                                             ▼
                            [ Leaflet OpenStreetMap Dashboard ]
                              (CartoDB Dark Matter / Tailwind)
```

### Module Breakdown

* **A. Command Centre Dashboard**: High-level tactical overview of active ambulances, route checkpoints, ETA confidence bands, IoT health, and live event audit stream.
* **B. Ambulance Tracking**: Full-screen interactive Leaflet OpenStreetMap (CartoDB Dark Matter) tracking ambulances along real Delhi corridors (*Connaught Place $\rightarrow$ Mandi House $\rightarrow$ ITO $\rightarrow$ Pragati Maidan $\rightarrow$ Ashram $\rightarrow$ AIIMS*).
* **C. AI/ML Prediction Engine**: Real Scikit-Learn ensemble model (`delhi_eta_model.joblib`, $R^2 = 0.9891$) computing predicted arrival times based on speed, distance, time of day, congestion factor ($1.0\times - 3.5\times$), and roadblocks.
* **D. IoT Intersection Management**: Multi-unit simulated roadside units (RSUs) implementing a 6-state finite state machine (`IDLE` $\rightarrow$ `ALERT_SENT` $\rightarrow$ `AMBULANCE_APPROACHING` $\rightarrow$ `ARRIVED_AT_CHECKPOINT` $\rightarrow$ `AMBULANCE_PASSED` $\rightarrow$ `RESET`) with simulated Wi-Fi RSSI, sound sensors, and P10 LED matrix display simulation.
* **E. Advance Alert System**: Two-stage alert workflow with Web Speech API text-to-speech speaker announcements.
* **F. Traffic Police Dashboard**: High-contrast operations desk with 1-click SOP clearance actions (*Acknowledge*, *Mark Preparing*, *Confirm Prepared*, *Escalate Obstacle*).
* **G. Simulation & Testing Lab**: Judges suite with 1-click scenarios (*Connaught Place to AIIMS Golden Hour Emergency*, *Peak Rush Hour with Roadblock*), variable speed controls, and obstacle injections.
* **H. Analytics & Journey Audit**: Complete timeline analytics, checkpoint response times, and 1-click CSV/JSON export.
* **I. Hardware Layer**: Arduino/ESP32 C++ firmware sketch (`hardware/esp32_rsu_node.ino`) and MQTT/REST payload inspector.

---

## 3. Implemented vs. Simulated Features

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Delhi Arterial Corridor Map** | Implemented | Real geographic coordinates across New Delhi |
| **AI/ML Regression Model** | Implemented | Scikit-Learn GradientBoosting + RandomForest |
| **Two-Stage Alert Engine** | Implemented | Approaching & Arrival/Passage states |
| **IoT 6-State FSM Simulator** | Implemented | IDLE to RESET state machine with PA audio |
| **Traffic Police Operations Desk**| Implemented | 1-Click SOP workflow & overrides |
| **Simulation Lab (Judges Suite)**| Implemented | Scenario testing, roadblock injection, playback |
| **Physical Traffic Signal Relays** | Advisory / Simulated | Safety design: relays require authorized police SOP clearance |
| **ESP32 Firmware Sketch** | Compilable C++ Code | Ready for hardware deployment via Arduino IDE / PlatformIO |

---

## 4. Local Quickstart

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:5173`.

### Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Swagger API docs available at `http://localhost:8000/docs`.

---

## 5. Regulatory & Safety Protocol Notice

This project is an **interactive MVP prototype**. In compliance with public safety regulations, signal preemption triggers provide advisory advance notices; physical traffic signal changes remain subject to authorized Delhi Traffic Police standard operating procedures.

---

## License

[MIT License](LICENSE) © 2026 CuriousKernel
