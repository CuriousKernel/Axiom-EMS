import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, ShieldAlert, Activity, Gauge, Navigation, AlertTriangle, CheckCircle2, Radio, Check } from 'lucide-react';
import { AmbulanceState, IntersectCheckpoint, TransitEventLog } from './types';
import { DELHI_CORRIDOR_WAYPOINTS, INITIAL_CHECKPOINTS } from './mockData';
import { calculatePredictedEta, getHaversineDistanceKm, interpolateRoutePosition } from './mlEngine';
import { LiveMap } from './components/LiveMap';
import { CheckpointCard } from './components/CheckpointCard';

export function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0.04);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [selectedCpId, setSelectedCpId] = useState<string | null>('RSU-01');

  // Ambulance State
  const [ambulance, setAmbulance] = useState<AmbulanceState>({
    id: 'AMB-DEL-09',
    callsign: 'ALS-Rescue-09',
    destination: 'AIIMS Trauma Center',
    currentLat: DELHI_CORRIDOR_WAYPOINTS[0][0],
    currentLng: DELHI_CORRIDOR_WAYPOINTS[0][1],
    speedKmh: 48,
    progressPercent: 4,
    distanceTraveledKm: 0.5,
    totalDistanceKm: 12.3,
    etaSeconds: 820,
    congestionMultiplier: 1.5,
    activeRisk: 'MODERATE',
    roadConditions: 'Peak rush-hour volume, signal priority active',
    status: 'EN_ROUTE'
  });

  const [checkpoints, setCheckpoints] = useState<IntersectCheckpoint[]>(INITIAL_CHECKPOINTS);
  const [eventLogs, setEventLogs] = useState<TransitEventLog[]>([
    {
      id: 'EVT-0',
      timestamp: '20:05:00',
      stage: 'IDLE',
      checkpointId: 'ORIGIN',
      checkpointName: 'Connaught Place Station',
      message: 'Ambulance dispatched. High-priority corridor initiated.',
      severity: 'info'
    }
  ]);

  // Voice Synthesizer
  const announceVoice = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  // Progression Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.0035 * speedMultiplier;
        if (next >= 1.0) {
          setIsPlaying(false);
          announceVoice('Ambulance arrived at AIIMS Trauma Center destination.');
          return 1.0;
        }
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Telemetry Calculation & Alert Workflow
  useEffect(() => {
    const [lat, lng] = interpolateRoutePosition(DELHI_CORRIDOR_WAYPOINTS, progress);
    const distTraveled = parseFloat((progress * 12.3).toFixed(2));
    const distRemaining = Math.max(0, 12.3 - distTraveled);

    const eta = calculatePredictedEta(
      distRemaining,
      ambulance.speedKmh,
      ambulance.congestionMultiplier,
      ambulance.activeRisk === 'HIGH' ? 3 : ambulance.activeRisk === 'MODERATE' ? 2 : 1
    );

    setAmbulance((prev) => ({
      ...prev,
      currentLat: lat,
      currentLng: lng,
      progressPercent: Math.round(progress * 100),
      distanceTraveledKm: distTraveled,
      etaSeconds: eta,
      status: progress >= 1.0 ? 'ARRIVED_DESTINATION' : 'EN_ROUTE'
    }));

    // Update Checkpoints (Two-Stage Alert Engine)
    setCheckpoints((prevList) =>
      prevList.map((cp) => {
        const distToJunc = getHaversineDistanceKm(lat, lng, cp.lat, cp.lng);
        let stage = cp.alertStage;
        let traffic = cp.trafficStatus;
        let rsu = cp.rsuStatus;
        let announcement = cp.speakerAnnouncement;
        let etaToJunc = Math.round((distToJunc / Math.max(15, ambulance.speedKmh)) * 3600);

        // Stage 2: Arrived at checkpoint (< 100m)
        if (distToJunc <= cp.arrivedTriggerKm) {
          if (cp.alertStage !== 'ARRIVED' && cp.alertStage !== 'CLEARED') {
            stage = 'ARRIVED';
            traffic = 'PREEMPTED';
            rsu = 'ACTIVE_ALERT';
            announcement = `STAGE 2: Emergency Vehicle AT INTERSECTION. Hold all cross-traffic.`;
            announceVoice(`Stage 2: Ambulance at ${cp.name}.`);

            setEventLogs((logs) => [
              {
                id: `EVT-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                stage: 'ARRIVED',
                checkpointId: cp.id,
                checkpointName: cp.name,
                message: `Stage 2 Triggered: Confirmed arrival at ${cp.name}. Cross-traffic preemption engaged.`,
                severity: 'alert'
              },
              ...logs.slice(0, 30)
            ]);
          }
        }
        // Stage 1: Approaching checkpoint (< 750m)
        else if (distToJunc <= cp.approachingTriggerKm) {
          if (cp.alertStage === 'ARRIVED') {
            stage = 'CLEARED';
            traffic = 'RESTORED';
            rsu = 'ONLINE';
            announcement = `Corridor cleared. Signal cycle restored to normal phasing.`;
            announceVoice(`Ambulance passed ${cp.name}. Corridor restored.`);

            setEventLogs((logs) => [
              {
                id: `EVT-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                stage: 'CLEARED',
                checkpointId: cp.id,
                checkpointName: cp.name,
                message: `Corridor Restored: Ambulance successfully passed ${cp.name}.`,
                severity: 'success'
              },
              ...logs.slice(0, 30)
            ]);
          } else if (cp.alertStage === 'IDLE') {
            stage = 'APPROACHING';
            traffic = 'PREPARING';
            rsu = 'ACTIVE_ALERT';
            announcement = `STAGE 1: Approaching in ${etaToJunc}s. Clear emergency lane.`;
            announceVoice(`Stage 1 alert: Ambulance approaching ${cp.name}.`);

            setEventLogs((logs) => [
              {
                id: `EVT-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                stage: 'APPROACHING',
                checkpointId: cp.id,
                checkpointName: cp.name,
                message: `Stage 1 Triggered: Approaching ${cp.name} (Lead distance: ${(distToJunc * 1000).toFixed(0)}m).`,
                severity: 'warning'
              },
              ...logs.slice(0, 30)
            ]);
          }
        }

        return {
          ...cp,
          alertStage: stage,
          trafficStatus: traffic,
          rsuStatus: rsu,
          etaSeconds: stage === 'CLEARED' ? 0 : etaToJunc,
          speakerAnnouncement: announcement
        };
      })
    );
  }, [progress]);

  const handleAcknowledge = (id: string) => {
    setCheckpoints((cps) =>
      cps.map((c) => (c.id === id ? { ...c, policeAcknowledged: true } : c))
    );
    announceVoice('Police officer acknowledged corridor preparedness.');
  };

  const handlePreemptTraffic = (id: string) => {
    setCheckpoints((cps) =>
      cps.map((c) =>
        c.id === id
          ? {
              ...c,
              trafficStatus: 'PREEMPTED',
              speakerAnnouncement: 'POLICE OVERRIDE: Cross-traffic held manually.'
            }
          : c
      )
    );
    announceVoice('Manual signal preemption activated.');
  };

  const handleReset = () => {
    setProgress(0.02);
    setIsPlaying(false);
    setCheckpoints(INITIAL_CHECKPOINTS);
    announceVoice('Simulation reset.');
  };

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#0b172a] border-b border-[#1e3a5f] sticky top-0 z-50 px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              🚑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-wider text-slate-100">AXIOM EMS</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  LIVE MODEL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                AI/ML-Powered Emergency Mobility & Intersection Preemption
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition ${
                voiceEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              Voice PA: {voiceEnabled ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.3)] transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono border border-slate-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </header>

      {/* Vision Statement Strip */}
      <section className="bg-gradient-to-r from-[#0d2144] via-[#09172e] to-[#0d2144] border-b border-[#1e3a5f]/80 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">OUR VISION:</span>
            <span>Go beyond finding the fastest route — help make the route ready.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Ensemble Regressor: Active</span>
            <span>•</span>
            <span>Two-Stage Alerts: Active</span>
            <span>•</span>
            <span>IoT Checkpoints: 6 Synced</span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Top Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#0f1f3d] p-3.5 rounded-xl border border-[#1e3a5f]">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>Ambulance Status</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {ambulance.status}
            </div>
            <div className="text-[11px] font-mono text-cyan-300 mt-1">{ambulance.callsign}</div>
          </div>

          <div className="bg-[#0f1f3d] p-3.5 rounded-xl border border-[#1e3a5f]">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>AI Estimated ETA</span>
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold font-mono text-amber-300">
              {Math.floor(ambulance.etaSeconds / 60)}m {ambulance.etaSeconds % 60}s
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Remaining: {(12.3 - ambulance.distanceTraveledKm).toFixed(1)} km
            </div>
          </div>

          <div className="bg-[#0f1f3d] p-3.5 rounded-xl border border-[#1e3a5f]">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>Current Velocity</span>
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-300">{ambulance.speedKmh} km/h</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Congestion: {ambulance.congestionMultiplier}x (Peak)
            </div>
          </div>

          <div className="bg-[#0f1f3d] p-3.5 rounded-xl border border-[#1e3a5f]">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>Route Risk Profile</span>
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-bold font-mono text-amber-400">
              {ambulance.activeRisk} RISK
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
              {ambulance.roadConditions}
            </div>
          </div>
        </div>

        {/* Map & Corridor Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
                Live GPS Corridor & Roadside Intersection Units
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Speed:</span>
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeedMultiplier(s)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono ${
                      speedMultiplier === s
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <LiveMap
              waypoints={DELHI_CORRIDOR_WAYPOINTS}
              ambulance={ambulance}
              checkpoints={checkpoints}
              selectedCheckpointId={selectedCpId}
              onSelectCheckpoint={(id) => setSelectedCpId(id)}
            />

            {/* Progression Bar */}
            <div className="bg-[#0f1f3d] p-4 rounded-xl border border-[#1e3a5f]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Connaught Place (Origin)</span>
                <span className="text-cyan-400 font-bold">{ambulance.progressPercent}% Corridor Cleared</span>
                <span>AIIMS Trauma Center (Destination)</span>
              </div>
              <div className="w-full bg-[#0a1628] h-2.5 rounded-full overflow-hidden border border-[#1e3a5f]">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${ambulance.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Traffic Police Console & Action Hub */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#0f1f3d] border border-[#1e3a5f] rounded-xl p-4 shadow-xl flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f] mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold tracking-wide text-slate-100">
                    Traffic Police Operations Console
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                  SOP Desk
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
                Receive Stage 1 advance advisories to clear emergency lanes, and apply manual signal hold when Stage 2 triggers at junction threshold.
              </p>

              {/* Selected Checkpoint Detail */}
              {selectedCpId && (
                <div className="bg-[#0a1628] p-3.5 rounded-lg border border-[#1e3a5f] space-y-2 mb-4">
                  <div className="text-xs font-mono text-cyan-400 font-bold">Selected Node: {selectedCpId}</div>
                  <div className="text-sm font-semibold text-slate-200">
                    {checkpoints.find((c) => c.id === selectedCpId)?.name}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Status: <b className="text-amber-300">{checkpoints.find((c) => c.id === selectedCpId)?.trafficStatus}</b>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleAcknowledge(selectedCpId)}
                      className="flex-1 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-mono flex items-center justify-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Acknowledge
                    </button>
                    <button
                      onClick={() => handlePreemptTraffic(selectedCpId)}
                      className="flex-1 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs font-mono flex items-center justify-center gap-1 transition"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Hold Signal
                    </button>
                  </div>
                </div>
              )}

              {/* Event Logs Mini Feed */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="text-xs font-mono text-slate-400 mb-2 font-semibold uppercase">
                  Recent Corridor Events
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs font-mono">
                  {eventLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded bg-[#0a1628]/80 border border-[#1e3a5f]/50 flex items-start gap-2 text-[11px]"
                    >
                      <span className="text-slate-500 whitespace-nowrap">{log.timestamp}</span>
                      <span
                        className={`font-semibold ${
                          log.severity === 'alert'
                            ? 'text-red-400'
                            : log.severity === 'warning'
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        [{log.stage}]
                      </span>
                      <span className="text-slate-300 line-clamp-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intersection Units Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
                Two-Stage Roadside IoT Units (RSU)
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Stage 1 (Approaching) announces voice advisory • Stage 2 (Arrived) holds opposing traffic
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {checkpoints.filter((c) => c.alertStage === 'APPROACHING' || c.alertStage === 'ARRIVED').length} Active Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkpoints.map((cp) => (
              <CheckpointCard
                key={cp.id}
                checkpoint={cp}
                isSelected={cp.id === selectedCpId}
                onSelect={() => setSelectedCpId(cp.id)}
                onAcknowledge={handleAcknowledge}
                onPreemptTraffic={handlePreemptTraffic}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b172a] border-t border-[#1e3a5f] py-4 px-6 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AXIOM EMS • Emergency Mobility System</span>
          <span className="text-slate-500">
            Delhi Smart City Arterial Corridor Prototype
          </span>
        </div>
      </footer>
    </div>
  );
}
export default App;
