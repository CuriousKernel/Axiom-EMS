import React from 'react';
import { IntersectCheckpoint } from '../types';
import { CheckCircle2, AlertTriangle, Radio, Volume2, ShieldAlert } from 'lucide-react';

interface CheckpointCardProps {
  checkpoint: IntersectCheckpoint;
  isSelected: boolean;
  onSelect: () => void;
  onAcknowledge: (id: string) => void;
  onPreemptTraffic: (id: string) => void;
}

export const CheckpointCard: React.FC<CheckpointCardProps> = ({
  checkpoint,
  isSelected,
  onSelect,
  onAcknowledge,
  onPreemptTraffic,
}) => {
  const getBadgeStyle = () => {
    switch (checkpoint.alertStage) {
      case 'APPROACHING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse';
      case 'ARRIVED':
        return 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse';
      case 'CLEARED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      default:
        return 'bg-slate-700/20 text-slate-400 border-slate-700/50';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-[#132040] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
          : 'bg-[#0f1f3d] border-[#1e3a5f] hover:border-slate-500'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">{checkpoint.id}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold ${getBadgeStyle()}`}>
              {checkpoint.alertStage}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-100 mt-1">{checkpoint.name}</h4>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">ETA to Junc</span>
          <div className="text-base font-bold font-mono text-cyan-300">
            {checkpoint.etaSeconds !== null ? `${checkpoint.etaSeconds}s` : '--'}
          </div>
        </div>
      </div>

      {/* RSU Speaker Announcement */}
      <div className="bg-[#0a1628] p-2 rounded-lg border border-[#1e3a5f]/60 mb-3 flex items-center gap-2 text-xs">
        <Volume2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="font-mono text-slate-300 truncate">{checkpoint.speakerAnnouncement}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1e3a5f]/50 text-xs">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-mono text-[11px]">RSU: {checkpoint.rsuStatus}</span>
        </div>

        <div className="flex gap-2">
          {!checkpoint.policeAcknowledged ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAcknowledge(checkpoint.id);
              }}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 rounded text-[11px] font-mono flex items-center gap-1 transition"
            >
              <AlertTriangle className="w-3 h-3" /> Ack Desk
            </button>
          ) : (
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ack'd
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreemptTraffic(checkpoint.id);
            }}
            className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-mono flex items-center gap-1 transition"
          >
            <ShieldAlert className="w-3 h-3" /> Hold Signal
          </button>
        </div>
      </div>
    </div>
  );
};
