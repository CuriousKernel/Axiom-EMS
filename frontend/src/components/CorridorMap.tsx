import React, { useEffect, useRef } from 'react';
import { ERSState } from '../types';
import L from 'leaflet';
import { Navigation, ShieldAlert, Radio } from 'lucide-react';

interface CorridorMapProps {
  state: ERSState;
  height?: string;
  onNavigateTab?: (tab: string) => void;
}

export const CorridorMap: React.FC<CorridorMapProps> = ({ 
  state, 
  height = '420px',
  onNavigateTab 
}) => {
  const { ambulance, checkpoints, iot_devices, environment } = state;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const checkpointMarkersRef = useRef<L.Marker[]>([]);

  // Predefined Delhi emergency routes
  const routeCoords = [
    [28.6328, 77.2195], // Connaught Place Radial 1
    [28.6315, 77.2250], // Barakhamba Rd
    [28.6290, 77.2300], // Barakhamba towards Mandi House
    [28.6258, 77.2343], // Mandi House Roundabout
    [28.6270, 77.2380], // Tilak Marg connection
    [28.6288, 77.2415], // ITO Junction
    [28.6240, 77.2430], // Ring road southbound
    [28.6180, 77.2440], // Bhairon Marg junction
    [28.6050, 77.2470], // Sarai Kale Khan stretch
    [28.5850, 77.2520], // Ring Road Nizamuddin
    [28.5708, 77.2600], // Ashram Chowk
    [28.5680, 77.2450], // Ring road towards Lajpat Nagar
    [28.5668, 77.2340], // Moolchand Underpass
    [28.5660, 77.2220], // South Extension Ring Road
    [28.5672, 77.2100]  // AIIMS New Delhi
  ] as [number, number][];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.6000, 77.2350],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Dynamic Markers, Polyline, and Halos
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Draw Route Polyline
    const activeRouteColor = environment.roadblock_active 
      ? '#EF4444' 
      : environment.traffic_density > 2.0 
      ? '#F59E0B' 
      : '#00E5FF';

    if (!routeLineRef.current) {
      routeLineRef.current = L.polyline(routeCoords, {
        color: activeRouteColor,
        weight: 6,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    } else {
      routeLineRef.current.setStyle({
        color: activeRouteColor
      });
    }

    // Clear and redraw Checkpoint Markers
    checkpointMarkersRef.current.forEach(m => m.remove());
    checkpointMarkersRef.current = [];

    checkpoints.forEach((cp, idx) => {
      const iot = iot_devices.find(d => d.device_id === cp.id);
      const isArrived = !!cp.arrived_timestamp && !cp.passed_timestamp;
      const isApproaching = cp.alert_stage1_sent && !cp.arrived_timestamp;
      const isPassed = !!cp.passed_timestamp;

      const haloColor = isArrived ? '#EF4444' : isApproaching ? '#F59E0B' : isPassed ? '#10B981' : '#00E5FF';
      const stageLabel = isArrived ? 'STAGE 2: ARRIVED' : isApproaching ? 'STAGE 1: ADVANCE' : isPassed ? 'CLEARED' : 'RSU IDLE';

      const customIcon = L.divIcon({
        className: 'custom-rsu-marker',
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${haloColor}25; border: 2px solid ${haloColor}; ${isApproaching || isArrived ? 'animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}"></div>
            <div style="width: 18px; height: 18px; border-radius: 50%; background: ${haloColor}; border: 2px solid #070B14; box-shadow: 0 0 16px ${haloColor}; display: flex; align-items: center; justify-content: center; color: #070B14; font-size: 10px; font-weight: 900; font-family: monospace;">
              ${idx + 1}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker(cp.coords, { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #F0F7FF; background: #0D1527; padding: 6px; border-radius: 6px; min-width: 180px;">
          <div style="font-weight: 800; color: #00E5FF; margin-bottom: 4px; font-size: 13px;">${cp.name}</div>
          <div style="color: #93B2D6;">RSU ID: <span style="color: #F0F7FF; font-weight: bold;">${cp.id}</span></div>
          <div style="color: #93B2D6; margin-top: 2px;">Status: <span style="color: ${haloColor}; font-weight: bold;">${stageLabel}</span></div>
          <div style="color: #93B2D6; margin-top: 2px;">Distance: <strong style="color: #F0F7FF;">${iot?.distance_to_ambulance_m !== null ? iot?.distance_to_ambulance_m + 'm' : 'N/A'}</strong></div>
          <div style="color: #93B2D6; margin-top: 2px;">ETA to Junc: <strong style="color: #F59E0B;">${iot?.eta_seconds ? iot.eta_seconds + 's' : 'N/A'}</strong></div>
          <div style="margin-top: 6px; font-size: 11px; color: #F0F7FF; border-top: 1px solid #1E3A5F; padding-top: 4px;">SOP: ${cp.recommended_action}</div>
        </div>
      `);
      checkpointMarkersRef.current.push(marker);
    });

    // Destination Hospital Marker (AIIMS)
    const destIcon = L.divIcon({
      className: 'dest-hospital-marker',
      html: `
        <div style="background: #10B981; color: #070B14; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: monospace; border: 2px solid #FFFFFF; box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);">
          H+
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    L.marker(ambulance.destination_coords, { icon: destIcon }).addTo(map).bindPopup(`
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #F0F7FF; background: #0D1527; padding: 6px; border-radius: 6px;">
        <strong style="color: #10B981; font-size: 13px;">DESTINATION HOSPITAL</strong><br/>
        <span style="color: #F0F7FF; font-weight: 700;">${ambulance.destination_name}</span><br/>
        <span style="color: #93B2D6; font-size: 11px;">Emergency Trauma Wing Ready</span>
      </div>
    `);

    // Dynamic Live Ambulance Marker with Pulsing Red Siren Beacon
    const ambIcon = L.divIcon({
      className: 'ambulance-beacon-marker',
      html: `
        <div style="position: relative; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.45); animation: ping 1s infinite;"></div>
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: #EF4444; border: 3px solid #FFFFFF; box-shadow: 0 0 25px #EF4444, 0 0 45px rgba(239, 68, 68, 0.8); display: flex; align-items: center; justify-content: center; color: white; font-size: 17px; font-weight: bold;">
            🚑
          </div>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });

    if (!ambulanceMarkerRef.current) {
      ambulanceMarkerRef.current = L.marker(ambulance.current_coords, { icon: ambIcon }).addTo(map);
    } else {
      ambulanceMarkerRef.current.setLatLng(ambulance.current_coords);
    }

  }, [ambulance.current_coords, checkpoints, iot_devices, environment.traffic_density, environment.roadblock_active]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#1E3A5F] shadow-2xl bg-[#070B14]" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Tactical Status Bar (Top Left) */}
      <div className="absolute top-3 left-3 z-[1000] bg-[#070B14]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#1E3A5F] text-xs font-mono flex items-center gap-3 shadow-xl">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
          <span className="text-[#F0F7FF] font-bold tracking-wide">AMBULANCE {ambulance.id}</span>
        </span>
        <span className="text-[#1E3A5F]">|</span>
        <span className="text-[#00E5FF] font-semibold">{ambulance.current_speed_kmh} km/h</span>
        <span className="text-[#1E3A5F]">|</span>
        <span className="text-[#F59E0B] font-semibold">ETA: {state.prediction.predicted_eta_formatted}</span>
      </div>

      {/* Floating Tactical Controls / Legend (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-[#070B14]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1E3A5F] text-[11px] font-mono text-[#93B2D6] flex items-center gap-3 shadow-lg">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Stage 1: Approaching
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Stage 2: Arrived
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Cleared
        </span>
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('tracking')}
            className="text-[#00E5FF] hover:underline font-bold ml-1"
          >
            Full Tracking &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
