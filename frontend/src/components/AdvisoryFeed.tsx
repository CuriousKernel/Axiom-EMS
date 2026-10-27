import React from 'react';
import { AdvisoryNotice } from '../types';
import { Newspaper, AlertOctagon, Info, ExternalLink } from 'lucide-react';

interface AdvisoryFeedProps {
  advisories: AdvisoryNotice[];
}

export const AdvisoryFeed: React.FC<AdvisoryFeedProps> = ({ advisories }) => {
  return (
    <div className="bg-[#0f1f3d] border border-[#1e3a5f] rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f] mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-100">
            Proposed TinyFish Public Notice Integration
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
          NLP Extractor
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3 font-mono leading-relaxed">
        Autonomous crawler synthesizing public road-closure advisories, municipal permits, and transport alerts directly into real-time routing penalties.
      </p>

      <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[360px]">
        {advisories.map((item) => {
          const isCritical = item.severity === 'CRITICAL';
          const isWarning = item.severity === 'WARNING';

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border text-xs transition-all ${
                isCritical
                  ? 'bg-red-500/10 border-red-500/30'
                  : isWarning
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  {isCritical ? (
                    <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed mb-2">{item.description}</p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-700/40">
                <span className="text-cyan-400">{item.source}</span>
                <span className="flex items-center gap-1 text-slate-300">
                  Impact Factor: <b className="text-amber-300">{item.impactScore}%</b>
                  <ExternalLink className="w-2.5 h-2.5 ml-1 text-slate-500" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
