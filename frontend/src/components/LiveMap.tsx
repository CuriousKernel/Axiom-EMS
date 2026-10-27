import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { IntersectCheckpoint, AmbulanceState } from '../types';

interface LiveMapProps {
  waypoints: [number, number][];
  ambulance: AmbulanceState;
  checkpoints: IntersectCheckpoint[];
  selectedCheckpointId: string | null;
  onSelectCheckpoint: (id: string) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  waypoints,
  ambulance,
  checkpoints,
  selectedCheckpointId,
  onSelectCheckpoint
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const checkpointMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.6000, 77.2350],
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    // Dark high-contrast CartoDB map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Corridor Route Polyline
    L.polyline(waypoints, {
      color: '#38bdf8',
      weight: 6,
      opacity: 0.8,
      dashArray: '6, 8'
    }).addTo(map);

    // Dynamic Pulsing Ambulance Marker
    const ambIcon = L.divIcon({
      className: 'amb-pulse-marker',
      html: `
        <div style="
          width: 40px; height: 40px;
          background: #ef4444;
          border: 3px solid #ffffff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px #ef4444;
          font-size: 18px;
          cursor: pointer;
        ">
          🚑
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const ambMarker = L.marker([ambulance.currentLat, ambulance.currentLng], { icon: ambIcon }).addTo(map);
    ambMarker.bindPopup(`<b>${ambulance.callsign}</b><br/>En Route: ${ambulance.destination}`);
    ambulanceMarkerRef.current = ambMarker;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Ambulance Position on map
  useEffect(() => {
    if (ambulanceMarkerRef.current) {
      ambulanceMarkerRef.current.setLatLng([ambulance.currentLat, ambulance.currentLng]);
    }
  }, [ambulance.currentLat, ambulance.currentLng]);

  // Update Intersections Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    checkpoints.forEach(cp => {
      let markerColor = '#0284c7'; // default blue
      let badgeLabel = 'IDLE';

      if (cp.alertStage === 'APPROACHING') {
        markerColor = '#f59e0b'; // Amber Stage 1
        badgeLabel = 'STAGE 1: ADVANCE';
      } else if (cp.alertStage === 'ARRIVED') {
        markerColor = '#ef4444'; // Red Stage 2
        badgeLabel = 'STAGE 2: PREEMPT';
      } else if (cp.alertStage === 'CLEARED') {
        markerColor = '#10b981'; // Green
        badgeLabel = 'CLEARED';
      }

      const isSelected = cp.id === selectedCheckpointId;

      const cpIcon = L.divIcon({
        className: `custom-rsu-${cp.id}`,
        html: `
          <div style="
            background: #0b172a;
            border: 2px solid ${markerColor};
            border-radius: 6px;
            padding: 3px 6px;
            color: #ffffff;
            font-size: 10px;
            font-family: monospace;
            white-space: nowrap;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 0 ${isSelected ? '16px' : '6px'} ${markerColor};
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            <span style="font-weight: 700; color: ${markerColor};">${cp.id}</span>
            <span style="font-size: 8px; opacity: 0.9;">${badgeLabel}</span>
          </div>
        `,
        iconSize: [75, 34],
        iconAnchor: [37, 17]
      });

      if (!checkpointMarkersRef.current.has(cp.id)) {
        const marker = L.marker([cp.lat, cp.lng], { icon: cpIcon }).addTo(map);
        marker.on('click', () => onSelectCheckpoint(cp.id));
        checkpointMarkersRef.current.set(cp.id, marker);
      } else {
        const existing = checkpointMarkersRef.current.get(cp.id);
        if (existing) {
          existing.setIcon(cpIcon);
        }
      }
    });
  }, [checkpoints, selectedCheckpointId, onSelectCheckpoint]);

  return (
    <div className="relative w-full h-[480px] rounded-xl overflow-hidden border border-[#1e3a5f] shadow-2xl bg-[#0a1628]">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Top Floating Badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-[#0b172a]/90 backdrop-blur px-3 py-2 rounded-lg border border-[#1e3a5f] text-xs font-mono flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-cyan-300 font-semibold">DELHI HIGH-PRIORITY CORRIDOR</span>
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-emerald-400 font-semibold">{checkpoints.length} RSU Nodes Connected</span>
      </div>

      <div className="absolute bottom-3 right-3 z-[1000] bg-[#0b172a]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-[#1e3a5f] text-[10px] text-slate-400 font-mono">
        CartoDB Dark • Real Coordinates
      </div>
    </div>
  );
};
