import { IntersectCheckpoint, AdvisoryNotice } from './types';

// Real geographic route in New Delhi: Connaught Place -> AIIMS via Ring Road & Barakhamba
export const DELHI_CORRIDOR_WAYPOINTS: [number, number][] = [
  [28.6328, 77.2195], // 0: CP Outer Circle (Origin)
  [28.6315, 77.2250], // 1: Barakhamba Road
  [28.6290, 77.2300], // 2: Barakhamba towards Mandi House
  [28.6258, 77.2343], // 3: Mandi House Roundabout
  [28.6270, 77.2380], // 4: Tilak Marg
  [28.6288, 77.2415], // 5: ITO Junction
  [28.6240, 77.2430], // 6: Ring Road Southbound
  [28.6180, 77.2440], // 7: Bhairon Marg / Pragati Maidan
  [28.6050, 77.2470], // 8: Sarai Kale Khan Corridor
  [28.5850, 77.2520], // 9: Nizamuddin Flyover
  [28.5708, 77.2600], // 10: Ashram Chowk
  [28.5680, 77.2450], // 11: Ring Road / Lajpat Nagar
  [28.5668, 77.2340], // 12: Moolchand Underpass
  [28.5660, 77.2220], // 13: South Extension
  [28.5672, 77.2100], // 14: AIIMS Trauma Center (Destination)
];

export const INITIAL_CHECKPOINTS: IntersectCheckpoint[] = [
  {
    id: 'RSU-DEL-01',
    name: 'Barakhamba Road Junction',
    lat: 28.6315,
    lng: 77.2250,
    distanceFromStartKm: 0.85,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.65,
    arrivedTriggerKm: 0.08,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby. Monitoring priority lane.',
    lastUpdated: 'Just now'
  },
  {
    id: 'RSU-DEL-02',
    name: 'Mandi House Roundabout',
    lat: 28.6258,
    lng: 77.2343,
    distanceFromStartKm: 2.1,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.70,
    arrivedTriggerKm: 0.09,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Just now'
  },
  {
    id: 'RSU-DEL-03',
    name: 'ITO Major Intersection',
    lat: 28.6288,
    lng: 77.2415,
    distanceFromStartKm: 3.4,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.80,
    arrivedTriggerKm: 0.10,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Just now'
  },
  {
    id: 'RSU-DEL-04',
    name: 'Pragati Maidan / Bhairon Marg',
    lat: 28.6180,
    lng: 77.2440,
    distanceFromStartKm: 4.9,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.75,
    arrivedTriggerKm: 0.08,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Just now'
  },
  {
    id: 'RSU-DEL-05',
    name: 'Ashram Chowk Underpass',
    lat: 28.5708,
    lng: 77.2600,
    distanceFromStartKm: 8.7,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.90,
    arrivedTriggerKm: 0.12,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby.',
    lastUpdated: 'Just now'
  },
  {
    id: 'RSU-DEL-06',
    name: 'AIIMS Flyover / Aurobindo Marg',
    lat: 28.5672,
    lng: 77.2100,
    distanceFromStartKm: 12.3,
    alertStage: 'IDLE',
    trafficStatus: 'NORMAL',
    rsuStatus: 'ONLINE',
    approachingTriggerKm: 0.65,
    arrivedTriggerKm: 0.08,
    etaSeconds: null,
    policeAcknowledged: false,
    speakerAnnouncement: 'RSU Standby. ER Gate Standby.',
    lastUpdated: 'Just now'
  }
];

export const INITIAL_ADVISORIES: AdvisoryNotice[] = [
  {
    id: 'ADV-TF-101',
    source: 'Proposed TinyFish Integration',
    title: 'Advisory: Construction Diversion on Outer Ring Road',
    description: 'Real-time transit advisory parsed from civic transport notice: Metro construction near Ashram creates 1.4x bottleneck on left lane.',
    severity: 'WARNING',
    corridor: 'Ashram - Sarai Kale Khan',
    timestamp: '12m ago',
    impactScore: 68
  },
  {
    id: 'ADV-TF-102',
    source: 'Delhi Traffic Police Notification',
    title: 'VIP Movement Clearance: Mathura Road Corridor',
    description: 'Temporary diversion lifted. Advance green corridor reservation granted for ambulance CALLSIGN DEL-AMB-09.',
    severity: 'INFO',
    corridor: 'ITO - Pragati Maidan',
    timestamp: '25m ago',
    impactScore: 25
  },
  {
    id: 'ADV-TF-103',
    source: 'Proposed TinyFish Integration',
    title: 'Public Notice: Waterlogged Underpass Alert',
    description: 'Advisory extraction: Localized waterlogging reduced clearance speed at Moolchand Underpass. AI model auto-rerouted to flyover.',
    severity: 'CRITICAL',
    corridor: 'Moolchand - South Extension',
    timestamp: '42m ago',
    impactScore: 82
  }
];
