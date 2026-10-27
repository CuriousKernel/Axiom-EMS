# AXIOM EMS — AI/ML-Powered Emergency Mobility

> **Smart City & Mobility · Ambulance Coordination · Route Intelligence**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=flat-square&logo=github)](https://curiouskernel.github.io/Axiom-EMS/)
[![React](https://img.shields.io/badge/React%2018-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive%20Maps-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🌐 Live Interactive Deployment

### 🚀 **[https://curiouskernel.github.io/Axiom-EMS/](https://curiouskernel.github.io/Axiom-EMS/)**

*Fully functional interactive emergency response web application running in-browser with real GPS routes, Scikit-ensemble ETA forecasting, and two-stage intersection preemption alerts.*

---

## What is AXIOM EMS?

**AXIOM EMS** is a Smart City & Mobility project designed to improve ambulance coordination using AI/ML, ETA prediction, and IoT-enabled checkpoint alerts. It helps traffic personnel anticipate ambulance arrivals, monitor route risks, and coordinate responses at upcoming intersections through a two-stage alert workflow.

> **Our Vision:** Go beyond finding the fastest route — help make the route ready.

---

## Key Features

- **Ambulance location tracking and ETA estimation**: Continuous tracking across arterial corridors with dynamic mathematical modeling for ETA under congestion.
- **Congestion and route-risk awareness**: Evaluates road conditions, peak traffic factors, and risk tiers (LOW, MODERATE, HIGH, CRITICAL).
- **Two-stage intersection alerts: approaching and arrived**:
  - *Stage 1 (Approaching)*: Signals traffic units when the emergency vehicle enters the dynamic lead threshold (< 750m) with PA voice notices.
  - *Stage 2 (Arrived)*: Detects junction threshold (< 100m) to hold cross-traffic, confirm passage, and restore phasing.
- **IoT-based roadside alert integration**: RSU node simulation providing real-time speaker audio feeds and signal status displays.
- **Traffic police monitoring and acknowledgement**: Dedicated dashboard with 1-click SOP clearance, corridor preparation, and manual hold signal overrides.
- **Proposed TinyFish integration**: Specialized intelligence module for retrieving relevant public road-closure notices, municipal permits, and transport advisories.

---

## System Architecture

```
   [ Emergency Vehicle GPS Telemetry ]
                   │
                   ▼
  ┌────────────────────────────────────────────────────────┐
  │                 AXIOM EMS Core Engine                  │
  ├────────────────────────┬───────────────────────────────┤
  │  AI/ML ETA Regressor   │  Two-Stage Alert Coordinator  │
  └──────────────┬─────────┴───────────────┬───────────────┘
                 │                         │
      ┌──────────┴──────────┐   ┌──────────┴──────────┐
      ▼                     ▼   ▼                     ▼
[ Leaflet HUD Map ]   [ IoT Nodes ] [ Police Console ][ TinyFish Feed ]
```

---

## Prototype Notice

*Note: The project prototype includes a simulated workflow. Live traffic feeds, physical IoT integration, and external data integrations require implementation and validation.*

---

## License

[MIT License](LICENSE) © 2026 CuriousKernel
