import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, ShieldCheck, Activity, Gauge, Navigation } from 'lucide-react';
import { AmbulanceState, IntersectCheckpoint, AdvisoryNotice, TransitEventLog } from './types';
import { DELHI_CORRIDOR_WAYPOINTS, INITIAL_CHECKPOINTS, INITIAL_ADVISORIES } from './mockData';
import { calculatePredictedEta, getHaversineDistanceKm, interpolateRoutePosition } from './mlEngine';
import { LiveMap } from './components/LiveMap';
import { CheckpointCard } from './components/CheckpointCard';
import { AdvisoryFeed } from './components/AdvisoryFeed';

export function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0.05); // 0 to 1 along the path
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [selectedCpId, setSelectedCpId] = useState<string | null>('RSU-DEL-01');

  // Core Ambulance State
  const [ambulance, setAmbulance] = useState<AmbulanceState>({
    id: 'AMB-DEL-09',
    callsign: 'ALS-Rescue-09',
    destination: 'AIIMS Trauma Center',
    currentLat: DELHI_CORRIDOR_WAYPOINTS[0][0],
    currentLng: DELHI_CORRIDOR_WAYPOINTS[0][1],
    speedKmh: 48,
    progressPercent: 5,
    distanceTraveledKm: 0.6,
    totalDistanceKm: 12.3,
    etaSeconds: 840,
    congestionMultiplier: 1.6,
    activeRisk: 'MODERATE',
    roadConditions: 'Normal evening traffic, peak corridor load',
    status: 'EN_ROUTE'
  });

  const [checkpoints, setCheckpoints] = useState<IntersectCheckpoint[]>(INITIAL_CHECKPOINTS);
  const [advisories] = useState<AdvisoryNotice[]>(INITIAL_ADVISORIES);
  const [eventLogs, setEventLogs] = useState<TransitEventLog[]>([
    {
      id: 'EVT-0',
      timestamp: '19:42:10',
      stage: 'IDLE',
      checkpointId: 'CP-OUTER',
      checkpointName: 'Connaught Place Origin',
      message: 'Ambulance dispatched with Level-1 Priority Green Corridor authorization.',
      severity: 'info'
    }
  ]);

  // Voice Speech Synthesizer
  const announceVoice = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('TTS error', e);
    }
  };

  // Simulation Loop
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.0035 * speedMultiplier;
        if (next >= 1.0) {
          setIsPlaying(false);
          announceVoice('Ambulance arrived at destination: AIIMS Trauma Center.');
          return 1.0;
        }
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Update Ambulance Coordinates & Checkpoint Statuses on Progress Change
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

    // Evaluate Checkpoints against Two-Stage Alert Workflow
    setCheckpoints((prevList) =>
      prevList.map((cp) => {
        const distToJunction = getHaversineDistanceKm(lat, lng, cp.lat, cp.lng);
        let newStage = cp.alertStage;
        let traffic = cp.trafficStatus;
        let rsu = cp.rsuStatus;
        let announcement = cp.speakerAnnouncement;
        let etaToJunc = Math.round((distToJunction / Math.max(15, ambulance.speedKmh)) * 3600);

        // Stage 2: Arrived (< 100m)
        if (distToJunction <= cp.arrivedTriggerKm) {
          if (cp.alertStage !== 'ARRIVED' && cp.alertStage !== 'CLEARED') {
            newStage = 'ARRIVED';
            traffic = 'PREEMPTED';
            rsu = 'ACTIVE_ALERT';
            announcement = `STAGE 2: Emergency Vehicle AT JUNCTION. Hold all cross-traffic.`;
            announceVoice(`Stage 2 alert. Ambulance arrived at ${cp.name}.`);

            setEventLogs((logs) => [
              {
                id: `EVT-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                stage: 'ARRIVED',
                checkpointId: cp.id,
                checkpointName: cp.name,
                message: `Stage 2 Triggered: Confirmed arrival at ${cp.name}. Cross-traffic held.`,
                severity: 'alert'
              },
              ...logs.slice(0, 30)
            ]);
          }
        }
        // Stage 1: Approaching (< 750m)
        else if (distToJunction <= cp.approachingTriggerKm) {
          // If already arrived before and now moving away
          if (cp.alertStage === 'ARRIVED') {
            newStage = 'CLEARED';
            traffic = 'RESTORED';
            rsu = 'ONLINE';
            announcement = `Ambulance cleared. Signal phasing restored to normal.`;
            announceVoice(`Ambulance cleared ${cp.name}. Phasing restored.`);

            setEventLogs((logs) => [
              {
                id: `EVT-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                stage: 'CLEARED',
                checkpointId: cp.id,
                checkpointName: cp.name,
                message: `Corridor Cleared: Resumed standard traffic cycle at ${cp.name}.`,
                severity: 'success'
              },
              ...logs.slice(0, 30)
            ]);
          } else if (cp.alertStage === 'IDLE') {
            newStage = 'APPROACHING';
            traffic = 'PREPARING';
            rsu = 'ACTIVE_ALERT';
            announcement = `STAGE 1: Ambulance approaching in approx ${etaToJunc}s. Clear lane.`;
            announceVoice(`Stage 1 alert: Ambulance approaching ${cp.name}.`);

            setEventLogs((logs) => [
              {
                id: `EVT-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                stage: 'APPROACHING',
                checkpointId: cp.id,
                checkpointName: cp.name,
                message: `Stage 1 Triggered: Approaching ${cp.name} (Lead distance: ${(distToJunction * 1000).toFixed(0)}m).`,
                severity: 'warning'
              },
              ...logs.slice(0, 30)
            ]);
          }
        }

        return {
          ...cp,
          alertStage: newStage,
          trafficStatus: traffic,
          rsuStatus: rsu,
          etaSeconds: newStage === 'CLEARED' ? 0 : etaToJunc,
          speakerAnnouncement: announcement
        };
      })
    );
  }, [progress]);

  const handleAcknowledge = (id: string) => {
    setCheckpoints((cps) =>
      cps.map((c) => (c.id === id ? { ...c, policeAcknowledged: true } : c))
    );
    announceVoice(`Traffic personnel acknowledged corridor clearance.`);
  };

  const handlePreemptTraffic = (id: string) => {
    setCheckpoints((cps) =>
      cps.map((c) =>
        c.id === id
          ? {
              ...c,
              trafficStatus: 'PREEMPTED',
              speakerAnnouncement: 'MANUAL OVERRIDE: Cross-traffic stopped by Police Console.'
            }
          : c
      )
    );
    announceVoice(`Manual signal preemption applied.`);
  };

  const handleReset = () => {
    setProgress(0.01);
    setIsPlaying(false);
    setCheckpoints(INITIAL_CHECKPOINTS);
    announceVoice('Simulation reset to origin.');
  };

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#0b172a] border-b border-[#1e3a5f] sticky top-0 z-50 px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              🚑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-wider text-slate-100">AXIOM EMS</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  DELHI COMMAND v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                AI/ML-Powered Emergency Mobility & Green Corridor Synchronization
              </p>
            </div>
          </div>

          {/* Simulation Controls & Voice Toggle */}
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
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Sim' : 'Resume Sim'}
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

      {/* Hero Vision Strip */}
      <section className="bg-gradient-to-r from-[#0d2144] via-[#09172e] to-[#0d2144] border-b border-[#1e3a5f]/80 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">OUR VISION:</span>
            <span>Go beyond finding the fastest route — help make the route ready.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>ML Model: Scikit Ensemble (R²=0.989)</span>
            <span>•</span>
            <span>2-Stage Alerts: Approaching / Arrived</span>
            <span>•</span>
            <span>Roadside IoT Nodes: Active</span>
          </div>
        </div>
      </section>

      {/* Main Command Dashboard */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Top Metric Telemetry Bar */}
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
              <span>ML Predicted ETA</span>
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
              <span>Route Risk Level</span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-bold font-mono text-amber-400">
              {ambulance.activeRisk} RISK
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
              {ambulance.roadConditions}
            </div>
          </div>
        </div>

        {/* Live Map & Advisory Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
                Corridor GPS & Two-Stage Intersection Telemetry
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Sim Speed:</span>
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeedMultiplier(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
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

            {/* Corridor Progression Tracker */}
            <div className="mt-4 bg-[#0f1f3d] p-4 rounded-xl border border-[#1e3a5f]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Connaught Place (Origin)</span>
                <span className="text-cyan-400 font-bold">{ambulance.progressPercent}% Transit Complete</span>
                <span>AIIMS Trauma Center (Dest)</span>
              </div>
              <div className="w-full bg-[#0a1628] h-2.5 rounded-full overflow-hidden border border-[#1e3a5f]">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${ambulance.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* TinyFish Public Notices / Advisories Feed */}
          <div className="lg:col-span-1">
            <AdvisoryFeed advisories={advisories} />
          </div>
        </div>

        {/* Checkpoint Units Grid & Police Desk */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-mono">
                Two-Stage Intersection Alert Nodes & Police Desk
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Stage 1 (Approaching) triggers audio & lead-time alerts • Stage 2 (Arrived) holds cross-traffic
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

        {/* Live Operational Event Logs */}
        <div className="bg-[#0f1f3d] border border-[#1e3a5f] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e3a5f]">
            <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-200">
              Live Emergency Response Event Log
            </h3>
            <span className="text-[11px] font-mono text-slate-400">{eventLogs.length} events logged</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 text-xs font-mono">
            {eventLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2 rounded bg-[#0a1628]/60 border border-[#1e3a5f]/40"
              >
                <span className="text-slate-500 whitespace-nowrap">{log.timestamp}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    log.severity === 'alert'
                      ? 'bg-red-500/20 text-red-300'
                      : log.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-300'
                      : log.severity === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  {log.stage}
                </span>
                <span className="text-slate-300 flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b172a] border-t border-[#1e3a5f] py-4 px-6 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AXIOM EMS • Emergency Mobility System • Prototype Model</span>
          <span className="text-slate-500">
            Simulated Workflow for Smart City Coordination • Delhi Command
          </span>
        </div>
      </footer>
    </div>
  );
}
export default App;
