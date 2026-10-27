export type AlertStage = 'IDLE' | 'APPROACHING' | 'ARRIVED' | 'CLEARED';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface IntersectCheckpoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceFromStartKm: number;
  alertStage: AlertStage;
  trafficStatus: 'NORMAL' | 'PREPARING' | 'PREEMPTED' | 'RESTORED';
  rsuStatus: 'ONLINE' | 'ACTIVE_ALERT' | 'STANDBY';
  approachingTriggerKm: number; // e.g. 0.8 km
  arrivedTriggerKm: number;     // e.g. 0.1 km
  etaSeconds: number | null;
  policeAcknowledged: boolean;
  speakerAnnouncement: string;
  lastUpdated: string;
}

export interface AmbulanceState {
  id: string;
  callsign: string;
  destination: string;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  progressPercent: number;
  distanceTraveledKm: number;
  totalDistanceKm: number;
  etaSeconds: number;
  congestionMultiplier: number;
  activeRisk: RiskLevel;
  roadConditions: string;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED_DESTINATION' | 'PAUSED';
}

export interface AdvisoryNotice {
  id: string;
  source: string; // 'TinyFish Traffic Intelligence' | 'Delhi Transport Dept' | 'Citizen Incident'
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  corridor: string;
  timestamp: string;
  impactScore: number; // 0 - 100
}

export interface TransitEventLog {
  id: string;
  timestamp: string;
  stage: AlertStage;
  checkpointId: string;
  checkpointName: string;
  message: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
}
