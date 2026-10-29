import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Building2, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeSurplusCount: number;
  inTransitCount: number;
  onResetDemo: () => void;
  onTriggerSurge: () => void;
  isSimulatingLiveTransit?: boolean;
  onToggleLiveSimulation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  activeSurplusCount,
  inTransitCount,
  onResetDemo,
  onTriggerSurge,
  isSimulatingLiveTransit,
  onToggleLiveSimulation
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playSuccessChime();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-500/15 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-emerald-600 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Food<span className="text-emerald-600">Loop</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Production v4.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">Surplus Food Redistribution & Safety Network</p>
            </div>
          </div>

          {/* Role Navigation Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => {
                soundManager.playNotificationTone();
                onSelectRole('DONOR');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'DONOR'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Donor</span>
              {activeSurplusCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {activeSurplusCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                onSelectRole('RECIPIENT');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'RECIPIENT'
                  ? 'bg-white text-sky-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-sky-600" />
              <span>Recipient NGO</span>
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                onSelectRole('DRIVER');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'DRIVER'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-teal-600" />
              <span>Fleet Logistics</span>
              {inTransitCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-teal-100 text-teal-800 animate-pulse">
                  {inTransitCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                onSelectRole('ADMIN');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'ADMIN'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safety & ESG</span>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {onToggleLiveSimulation && (
              <button
                onClick={onToggleLiveSimulation}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSimulatingLiveTransit
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                }`}
                title="Toggle Real-Time Animated GPS Vehicle Movement Simulation"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{isSimulatingLiveTransit ? 'Live GPS Active' : 'Simulate GPS Transit'}</span>
              </button>
            )}

            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute Audio Chimes' : 'Mute Audio Chimes'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                onTriggerSurge();
              }}
              title="Simulate Event Caterer Surplus Surge"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Add Surge</span>
            </button>

            <button
              onClick={() => {
                soundManager.playNotificationTone();
                onResetDemo();
              }}
              title="Reset Demo Data"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
