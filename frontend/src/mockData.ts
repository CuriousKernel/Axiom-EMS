import { IntersectCheckpoint } from './types';

// Genuine Delhi arterial corridor from Connaught Place to AIIMS
export const DELHI_CORRIDOR_WAYPOINTS: [number, number][] = [
  [28.6328, 77.2195], // Connaught Place Inner/Outer Circle
  [28.6315, 77.2250], // Barakhamba Road
  [28.6290, 77.2300], // Barakhamba approaching Mandi House
  [28.6258, 77.2343], // Mandi House Roundabout
  [28.6270, 77.2380], // Tilak Marg
  [28.6288, 77.2415], // ITO Junction
  [28.6240, 77.2430], // Ring Road Southbound
  [28.6180, 77.2440], // Bhairon Marg / Pragati Maidan
  [28.6050, 77.2470], // Sarai Kale Khan
  [28.5850, 77.2520], // Nizamuddin Flyover
  [28.5708, 77.2600], // Ashram Chowk
  [28.5680, 77.2450], // Ring Road / Lajpat Nagar
  [28.5668, 77.2340], // Moolchand Underpass
  [28.5660, 77.2220], // South Extension
  [28.5672, 77.2100], // AIIMS Trauma Center (Destination)
];

export const INITIAL_CHECKPOINTS: IntersectCheckpoint[] = [
  {
    id: 'RSU-01',
    name: 'Barakhamba Road Junction',
    lat: 28.6315,
    lng: 77.2250,
    distanceFromStartKm: 0.85,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.70,
    arrivedTriggerKm: 0.10,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby. Monitoring priority lane.',
    lastUpdated: 'Live'
  },
  {
    id: 'RSU-02',
    name: 'Mandi House Roundabout',
    lat: 28.6258,
    lng: 77.2343,
    distanceFromStartKm: 2.1,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.75,
    arrivedTriggerKm: 0.10,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Live'
  },
  {
    id: 'RSU-03',
    name: 'ITO Major Intersection',
    lat: 28.6288,
    lng: 77.2415,
    distanceFromStartKm: 3.4,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.80,
    arrivedTriggerKm: 0.12,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Live'
  },
  {
    id: 'RSU-04',
    name: 'Pragati Maidan / Bhairon Marg',
    lat: 28.6180,
    lng: 77.2440,
    distanceFromStartKm: 4.9,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.75,
    arrivedTriggerKm: 0.10,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Live'
  },
  {
    id: 'RSU-05',
    name: 'Ashram Chowk Underpass',
    lat: 28.5708,
    lng: 77.2600,
    distanceFromStartKm: 8.7,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.90,
    arrivedTriggerKm: 0.14,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Live'
  },
  {
    id: 'RSU-06',
    name: 'AIIMS Flyover / Aurobindo Marg',
    lat: 28.5672,
    lng: 77.2100,
    distanceFromStartKm: 12.3,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.75,
    arrivedTriggerKm: 0.10,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby. Emergency Gate Ready.',
    lastUpdated: 'Live'
  }
];
