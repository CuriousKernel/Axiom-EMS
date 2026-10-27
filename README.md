# AXIOM EMS — AI/ML-Powered Emergency Mobility

> **Smart City & Mobility · Ambulance Coordination · Route Intelligence**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=flat-square&logo=github)](https://curiouskernel.github.io/Axiom-EMS/)
[![React](https://img.shields.io/badge/React%2018-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive%20Maps-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🌐 Live Interactive Deployment

### 🚀 **[https://curiouskernel.github.io/Axiom-EMS/](https://curiouskernel.github.io/Axiom-EMS/)**

*Working interactive emergency mobility model featuring real Delhi arterial corridors, live regression-based ETA calculations, and two-stage intersection preemption alerts.*

---

## What is AXIOM EMS?

**AXIOM EMS** is a Smart City & Mobility project designed to improve ambulance coordination using AI/ML, ETA prediction, and IoT-enabled checkpoint alerts. It helps traffic personnel anticipate ambulance arrivals, monitor route risks, and coordinate responses at upcoming intersections through a two-stage alert workflow.

> **Our Vision:** Go beyond finding the fastest route — help make the route ready.

---

## Key Features

- **Ambulance location tracking and ETA estimation**: Continuous tracking across arterial corridors with dynamic mathematical modeling for ETA under real-time congestion.
- **Congestion and route-risk awareness**: Live road status profiling, rush-hour volume adjustments, and dynamic risk tiers (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **Two-stage intersection alerts: approaching and arrived**:
  - *Stage 1 (Approaching)*: Signals traffic units when the ambulance enters the lead threshold ($< 750\text{ m}$) with PA voice notices and advance advisories.
  - *Stage 2 (Arrived)*: Detects junction threshold arrival ($< 100\text{ m}$) to hold cross-traffic, verify clear passage, and restore normal signal phasing.
- **IoT-based roadside alert integration**: Simulated RSU nodes displaying live states, acoustic announcements, and signal preemption flags.
- **Traffic police monitoring and acknowledgement**: Tactical operations console allowing duty officers to acknowledge corridor clearance and trigger manual signal hold overrides.

---

## Prototype Notice

*Note: The project prototype includes a simulated workflow. Live traffic feeds and physical IoT integration require implementation and validation.*

---

## License

[MIT License](LICENSE) © 2026 CuriousKernel
