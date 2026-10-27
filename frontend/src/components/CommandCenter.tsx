import React from 'react';
import { ERSState } from '../types';
import { 
  Ambulance as AmbulanceIcon, 
  Clock, 
  Radio, 
  TrendingUp, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  Navigation,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { CorridorMap } from './CorridorMap';

interface CommandCenterProps {
  state: ERSState;
  onPlayToggle: () => void;
  onStep: () => void;
  onReset: () => void;
  onNavigateTab: (tab: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  state,
  onPlayToggle,
  onStep,
  onReset,
  onNavigateTab
}) => {
  const { ambulance, environment, prediction, simulation, iot_devices, checkpoints, recent_events } = state;
  const onlineDevices = iot_devices.filter(d => d.is_online).length;
  const totalDevices = iot_devices.length;

  return (
    <div className="space-y-6">
      {/* Hero Operational Banner */}
      <div className="bg-gradient-to-r from-[#0B1528] via-[#0F1F3D] to-[#0B1528] border border-[#1E3A5F] rounded-xl p-5 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="inline-block w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_12px_#EF4444] animate-ping" />
              <h1 className="text-xl sm:text-2xl font-bold text-[#F0F7FF] tracking-wider font-hud">
                CENTRAL EMERGENCY DISPATCH CONSOLE
              </h1>
              <span className="text-[10px] bg-[#070B14] text-[#00E5FF] px-2.5 py-0.5 rounded border border-[#00E5FF]/40 font-mono tracking-wider font-bold">
                NCT OF DELHI
              </span>
            </div>
            <p className="text-[#93B2D6] text-xs sm:text-sm mt-1 tracking-wide font-sans">
              Live AI-assisted corridor coordination: <span className="text-[#00E5FF] font-semibold">{ambulance.origin_name}</span> &rarr; <span className="text-[#10B981] font-semibold">{ambulance.destination_name}</span>.
            </p>
          </div>

          {/* Quick Simulation Action Bar */}
          <div className="flex items-center space-x-2 bg-[#070B14]/90 border border-[#1E3A5F] p-2 rounded-xl shadow-inner">
            <button
              onClick={onPlayToggle}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold font-mono transition shadow-lg ${
                simulation.is_running
                  ? 'bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#070B14] shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#070B14] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
              }`}
            >
              {simulation.is_running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{simulation.is_running ? 'PAUSE CORRIDOR' : 'DISPATCH SIMULATION'}</span>
            </button>

            <button
              onClick={onStep}
              disabled={simulation.is_running}
              className="flex items-center space-x-1 px-3 py-2 bg-[#0F1F3D] hover:bg-[#1E3A5F] disabled:opacity-40 text-[#F0F7FF] rounded-lg text-xs font-mono transition border border-[#1E3A5F]"
              title="Advance ambulance 1 waypoint"
            >
              <SkipForward className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>STEP</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center space-x-1 px-3 py-2 bg-[#0F1F3D] hover:bg-[#1E3A5F] text-[#93B2D6] hover:text-[#F0F7FF] rounded-lg text-xs font-mono transition border border-[#1E3A5F]"
              title="Reset simulation to Connaught Place"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Ambulance Card */}
        <div className="bg-[#0B1528] border border-[#1E3A5F] hover:border-[#EF4444]/60 rounded-xl p-4 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.7)] transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#93B2D6] font-mono font-medium">Active Ambulance</p>
              <h3 className="text-2xl font-bold font-hud text-[#F0F7FF] mt-1 tracking-wider">{ambulance.id}</h3>
              <p className="text-xs text-[#EF4444] font-bold mt-0.5 flex items-center space-x-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444] animate-ping inline-block" />
                <span>{ambulance.priority} (Critical)</span>
              </p>
            </div>
            <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/40 rounded-xl text-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-105 transition">
              <AmbulanceIcon className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E3A5F]/80 flex justify-between text-xs text-[#93B2D6] font-mono">
            <span>Speed: <strong className="text-[#00E5FF] font-hud text-sm">{ambulance.current_speed_kmh} km/h</strong></span>
            <span>Progress: <strong className="text-[#10B981] font-hud text-sm">{ambulance.route_progress_pct}%</strong></span>
          </div>
        </div>

        {/* Predicted ETA Card */}
        <div className="bg-[#0B1528] border border-[#1E3A5F] hover:border-[#00E5FF]/60 rounded-xl p-4 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.7)] transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#93B2D6] font-mono font-medium">Predicted Arrival (ETA)</p>
              <h3 className="text-2xl font-bold font-hud text-[#00E5FF] mt-1 tracking-wider drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                {prediction.predicted_eta_formatted}
              </h3>
              <p className="text-xs text-[#93B2D6] mt-0.5 font-mono">
                Baseline (Naive): <span className="line-through text-[#93B2D6]/70">{prediction.baseline_eta_formatted}</span>
              </p>
            </div>
            <div className="p-3 bg-[#00E5FF]/15 border border-[#00E5FF]/40 rounded-xl text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)] group-hover:scale-105 transition">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E3A5F]/80 flex justify-between text-xs font-mono">
            <span className="text-[#93B2D6]">Dist: <strong className="text-[#F0F7FF] font-hud text-sm">{ambulance.remaining_distance_km} km</strong></span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
              prediction.delay_risk === 'CRITICAL' ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
              prediction.delay_risk === 'HIGH' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/60' :
              'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/60'
            }`}>
              {prediction.delay_risk} RISK
            </span>
          </div>
        </div>

        {/* IoT Roadside Units */}
        <div className="bg-[#0B1528] border border-[#1E3A5F] hover:border-[#10B981]/60 rounded-xl p-4 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.7)] transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#93B2D6] font-mono font-medium">IoT Roadside Units</p>
              <h3 className="text-2xl font-bold font-hud text-[#F0F7FF] mt-1 tracking-wider">
                {onlineDevices} / {totalDevices}
              </h3>
              <p className="text-xs text-[#10B981] font-medium mt-0.5 font-mono">
                {Math.round((onlineDevices / totalDevices) * 100)}% Hardware Mesh Online
              </p>
            </div>
            <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition">
              <Radio className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E3A5F]/80 flex justify-between text-xs text-[#93B2D6] font-mono">
            <span>Next RSU: <strong className="text-[#00E5FF] truncate block max-w-[150px]">{ambulance.next_checkpoint}</strong></span>
          </div>
        </div>

        {/* Delhi Traffic Congestion */}
        <div className="bg-[#0B1528] border border-[#1E3A5F] hover:border-[#F59E0B]/60 rounded-xl p-4 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.7)] transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#93B2D6] font-mono font-medium">Delhi Traffic Multiplier</p>
              <h3 className="text-2xl font-bold font-hud text-[#F59E0B] mt-1 tracking-wider drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                {environment.traffic_density}x
              </h3>
              <p className="text-xs text-[#93B2D6] mt-0.5 font-mono">
                Corridor: <strong className="text-[#F0F7FF]">{environment.traffic_label}</strong>
              </p>
            </div>
            <div className="p-3 bg-[#F59E0B]/15 border border-[#F59E0B]/40 rounded-xl text-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E3A5F]/80 flex justify-between text-xs text-[#93B2D6] font-mono">
            <span>Roadblock: {environment.roadblock_active ? <strong className="text-[#EF4444] animate-pulse">ACTIVE</strong> : <strong className="text-[#10B981]">CLEAR</strong>}</span>
            <span>Alert Lead: <strong className="text-[#00E5FF]">{prediction.recommended_advance_alert_lead_seconds}s</strong></span>
          </div>
        </div>
      </div>

      {/* Central Visual: Hero Interactive Leaflet Corridor Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-[#00E5FF]" />
            <h2 className="text-sm font-bold text-[#F0F7FF] uppercase tracking-wider font-hud">
              Live Delhi Corridor Navigation & Emergency Vehicle Tracking
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#93B2D6]">
            <span>Corridor Progress: <strong className="text-[#00E5FF] font-bold">{ambulance.route_progress_pct}%</strong></span>
          </div>
        </div>

        <CorridorMap state={state} height="430px" onNavigateTab={onNavigateTab} />

        {/* Corridor Route Progression Bar */}
        <div className="bg-[#0B1528] p-3 rounded-xl border border-[#1E3A5F] flex items-center gap-4">
          <span className="text-xs font-mono text-[#93B2D6] whitespace-nowrap">Connaught Place</span>
          <div className="flex-1 bg-[#070B14] h-3 rounded-full overflow-hidden border border-[#1E3A5F] relative">
            <div 
              className="bg-gradient-to-r from-[#00E5FF] via-[#F59E0B] to-[#10B981] h-full rounded-full transition-all duration-300"
              style={{ width: `${ambulance.route_progress_pct}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#10B981] font-bold whitespace-nowrap">AIIMS Trauma Center</span>
        </div>
      </div>

      {/* Corridor Progress & Checkpoint Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Intersections & 2-Stage Alert Matrix */}
        <div className="lg:col-span-2 bg-[#0B1528] border border-[#1E3A5F] rounded-xl p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#F0F7FF] flex items-center space-x-2 font-hud tracking-wide">
                <ShieldAlert className="w-4 h-4 text-[#00E5FF]" />
                <span>CORRIDOR CHECKPOINTS & 2-STAGE ALERT PROGRESSION</span>
              </h2>
              <p className="text-xs text-[#93B2D6] mt-0.5">
                Stage 1 (Approaching &lt;650m) &rarr; Stage 2 (Intersection Arrival & Clearance)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('iot')}
              className="text-xs text-[#00E5FF] hover:underline font-mono tracking-wider flex items-center space-x-1"
            >
              <span>RSU Mesh View &rarr;</span>
            </button>
          </div>

          {/* Interactive Checkpoint Stepper */}
          <div className="space-y-3">
            {checkpoints.map((cp, idx) => {
              const iot = iot_devices.find(d => d.device_id === cp.id);
              const isPassed = !!cp.passed_timestamp;
              const isArrived = !!cp.arrived_timestamp && !cp.passed_timestamp;
              const isApproaching = cp.alert_stage1_sent && !cp.arrived_timestamp;

              return (
                <div 
                  key={cp.id}
                  className={`p-3.5 rounded-xl border transition duration-200 ${
                    isArrived 
                      ? 'bg-[#EF4444]/15 border-[#EF4444] shadow-[0_0_20px_-3px_rgba(239,68,68,0.4)] animate-pulse' 
                      : isApproaching 
                      ? 'bg-[#F59E0B]/15 border-[#F59E0B] shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]' 
                      : isPassed 
                      ? 'bg-[#10B981]/10 border-[#10B981]/40 opacity-90' 
                      : 'bg-[#0F1F3D]/50 border-[#1E3A5F]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isPassed ? 'bg-[#10B981] text-[#070B14]' :
                        isArrived ? 'bg-[#EF4444] text-[#FFFFFF] shadow-[0_0_12px_#EF4444] animate-ping' :
                        isApproaching ? 'bg-[#F59E0B] text-[#070B14]' :
                        'bg-[#1E3A5F] text-[#93B2D6]'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-[#F0F7FF] tracking-wide">{cp.name}</h4>
                          <span className="text-[10px] font-mono bg-[#070B14] text-[#00E5FF] px-2 py-0.5 rounded border border-[#1E3A5F]">
                            {cp.id}
                          </span>
                        </div>
                        <p className="text-xs text-[#93B2D6] mt-0.5">
                          SOP: <span className="text-[#F0F7FF]/90 font-medium">{cp.recommended_action}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:self-center font-mono text-xs">
                      {isPassed && (
                        <span className="px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> CLEARED
                        </span>
                      )}
                      {isArrived && (
                        <span className="px-2.5 py-1 rounded-full bg-[#EF4444] text-white border border-[#FFFFFF]/60 font-bold shadow-[0_0_12px_#EF4444] animate-pulse">
                          STAGE 2: AT JUNCTION
                        </span>
                      )}
                      {isApproaching && (
                        <span className="px-2.5 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/60 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> STAGE 1: APPROCHING ({iot?.eta_seconds}s)
                        </span>
                      )}
                      {!isPassed && !isArrived && !isApproaching && (
                        <span className="px-2.5 py-1 rounded-full bg-[#070B14] text-[#93B2D6] border border-[#1E3A5F]">
                          STANDBY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Roadside Speaker Announcement simulation readout */}
                  {iot && iot.speaker_active && (
                    <div className="mt-2.5 pt-2 border-t border-[#1E3A5F]/60 flex items-center space-x-2 text-xs font-mono text-[#F59E0B]">
                      <Volume2 className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
                      <span className="truncate">PA Announcement: "{iot.last_audio_announcement}"</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Audit Stream */}
        <div className="bg-[#0B1528] border border-[#1E3A5F] rounded-xl p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h2 className="text-base font-bold text-[#F0F7FF] font-hud tracking-wide">
                OPERATIONAL EVENT FEED
              </h2>
              <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-0.5 bg-[#070B14] rounded border border-[#1E3A5F]">
                LIVE LOG
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {recent_events.slice(0, 8).map((evt) => (
                <div key={evt.id} className="p-2.5 rounded-lg bg-[#070B14]/80 border border-[#1E3A5F]/70 text-xs font-mono">
                  <div className="flex justify-between text-[#93B2D6] text-[10px] mb-1">
                    <span>{evt.time_str}</span>
                    <span className="text-[#00E5FF] font-semibold">{evt.event_type}</span>
                  </div>
                  <p className="text-[#F0F7FF] text-[11px] leading-relaxed">{evt.message}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="w-full py-2.5 bg-[#0F1F3D] hover:bg-[#1E3A5F] text-[#00E5FF] rounded-lg text-xs font-mono tracking-wider font-semibold transition border border-[#1E3A5F] text-center"
          >
            Export Full Audit Logs (CSV/JSON) &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
