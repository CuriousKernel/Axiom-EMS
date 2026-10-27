import React from 'react';
import { 
  Activity, 
  MapPin, 
  Cpu, 
  Radio, 
  ShieldAlert, 
  FlaskConical, 
  BarChart3, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  AlertTriangle 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  voiceAlertsEnabled: boolean;
  setVoiceAlertsEnabled: (val: boolean) => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  voiceAlertsEnabled,
  setVoiceAlertsEnabled,
  isBackendConnected
}) => {
  const navItems = [
    { id: 'command', label: 'Command Centre', icon: Activity },
    { id: 'tracking', label: 'Ambulance Tracking', icon: MapPin },
    { id: 'ml', label: 'AI/ML Engine', icon: Cpu },
    { id: 'iot', label: 'IoT Intersections', icon: Radio },
    { id: 'police', label: 'Traffic Police Console', icon: ShieldAlert },
    { id: 'lab', label: 'Simulation & Testing Lab', icon: FlaskConical },
    { id: 'analytics', label: 'Analytics & Logs', icon: BarChart3 },
    { id: 'hardware', label: 'Hardware & Architecture', icon: BookOpen },
  ];

  return (
    <header className="bg-[#0B1528]/95 border-b border-[#1E3A5F] sticky top-0 z-50 backdrop-blur-md shadow-2xl">
      {/* Top Urgent Alert Bar */}
      <div className="bg-gradient-to-r from-[#070B14] via-[#0B1528] to-[#070B14] px-4 py-1.5 flex flex-wrap items-center justify-between text-xs border-b border-[#1E3A5F]/70">
        <div className="flex items-center space-x-3">
          {/* DEMO MODE Badge */}
          <div className="flex items-center space-x-1.5 bg-[#F59E0B]/20 border border-[#F59E0B]/80 text-[#F59E0B] px-3 py-0.5 rounded-full font-mono text-[11px] font-bold tracking-wider animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>DEMO MODE ACTIVE</span>
          </div>

          <span className="hidden sm:inline text-[#93B2D6] text-xs font-hud tracking-wide">
            Delhi Traffic Police & Health Infrastructure Coordination Grid (NCT of Delhi)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Telemetry Status */}
          <div className="flex items-center space-x-1.5 text-[#93B2D6] text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isBackendConnected ? 'bg-[#10B981] shadow-[0_0_8px_#10B981]' : 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'}`} />
            <span className="font-mono text-[11px] tracking-wider text-[#F0F7FF] font-semibold">
              {isBackendConnected ? 'FASTAPI BACKEND CONNECTED' : 'CLIENT DUAL-ENGINE SIMULATOR'}
            </span>
          </div>

          {/* Voice Announcement Toggle */}
          <button
            onClick={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs transition border font-mono font-bold ${
              voiceAlertsEnabled 
                ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]' 
                : 'bg-[#0F1F3D] border-[#1E3A5F] text-[#93B2D6] hover:border-[#00E5FF]/40'
            }`}
            title="Toggle Text-to-Speech roadside announcement demo"
          >
            {voiceAlertsEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00E5FF] animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px]">TTS PA: {voiceAlertsEnabled ? 'ONLINE' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Main Branding & Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('command')}>
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/70 flex items-center justify-center text-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:border-[#EF4444] transition">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-widest text-[#F0F7FF] font-hud">
                  AXIOM <span className="text-[#00E5FF]">EMS</span>
                </span>
                <span className="text-[10px] bg-[#EF4444]/20 border border-[#EF4444]/70 text-[#EF4444] px-2 py-0.5 rounded font-mono font-black tracking-wider">
                  PRIORITY 1
                </span>
              </div>
              <p className="text-[11px] text-[#93B2D6] hidden sm:block tracking-wide">
                ERS — Emergency Response Synchronization (Delhi Grid)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition ${
                    isActive
                      ? 'bg-[#0F1F3D] text-[#00E5FF] border border-[#00E5FF]/60 shadow-[0_0_15px_-3px_rgba(0,229,255,0.35)]'
                      : 'text-[#93B2D6] hover:text-[#F0F7FF] hover:bg-[#0F1F3D]/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00E5FF]' : 'text-[#93B2D6]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Scroll */}
      <div className="lg:hidden px-2 pb-2 overflow-x-auto flex space-x-1 border-t border-[#1E3A5F]/60 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition font-mono ${
                isActive
                  ? 'bg-[#0F1F3D] text-[#00E5FF] border border-[#00E5FF]/60 shadow-[0_0_10px_rgba(0,229,255,0.3)] font-bold'
                  : 'text-[#93B2D6] bg-[#070B14] border border-[#1E3A5F]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
