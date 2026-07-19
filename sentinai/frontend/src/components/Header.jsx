import React, { useState, useEffect } from 'react';
import { Shield, Activity, Clock, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function Header({ systemStatus, currentScenario, leadTime }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusBadge = () => {
    if (systemStatus === 'CRITICAL_COMPOUND_HAZARD') {
      return (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/40 text-red-400 px-3 py-1 rounded text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span>CRITICAL COMPOUND HAZARD</span>
        </div>
      );
    }
    if (systemStatus === 'ADVISORY_WARNING') {
      return (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-400 px-3 py-1 rounded text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>SAFETY ADVISORY ACTIVE</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded text-xs font-medium">
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span>SYSTEM OPERATIONAL</span>
      </div>
    );
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600/10 border border-blue-500/30 p-2 rounded text-blue-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-100 tracking-tight">SentinAI Safety Platform</h1>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">v2.4</span>
          </div>
          <p className="text-xs text-slate-400">Industrial Safety Intelligence Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {getStatusBadge()}

        {leadTime > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded flex items-center gap-2 text-xs">
            <span className="text-slate-400">Early Warning:</span>
            <span className="font-bold font-mono text-red-400">{leadTime} MIN LEAD TIME</span>
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{time}</span>
        </div>
      </div>
    </header>
  );
}
