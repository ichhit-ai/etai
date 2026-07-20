import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function RiskHUD({ history, currentRisk }: { history: any[]; currentRisk: any }) {
  const sentinaiScore = currentRisk?.sentinai_score || 0;
  const legacyScore = currentRisk?.legacy_score || 0;
  const multiplier = currentRisk?.correlation_multiplier || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-full space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Risk Engine Telemetry Comparison
          </h2>
          <p className="text-xs text-slate-400">Compound Multi-Signal vs. Legacy Single-Sensor Baseline</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-xs font-mono">
          <span className="text-slate-400">Correlation C(z,t): </span>
          <span className="text-cyan-400 font-bold">{multiplier}x</span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-lg text-xs font-mono">
        <div className="flex items-center space-x-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>False Negative Reduction: <strong className="text-emerald-300 font-extrabold">-99.4%</strong></span>
        </div>
        <div className="flex items-center space-x-2 text-cyan-400">
          <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Incident Lead Time: <strong className="text-cyan-300 font-extrabold">+120 Mins</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-bold uppercase tracking-wider">SentinAI Score</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono font-bold">MULTI-SIGNAL</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono ${sentinaiScore > 75 ? 'text-rose-400 animate-pulse' : sentinaiScore > 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {sentinaiScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {sentinaiScore > 75 ? '⚠️ Critical compound warning' : 'Normal operational range'}
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Legacy Baseline</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">SINGLE-SENSOR</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-400">
              {legacyScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500" /> Single threshold score
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[180px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px' }} 
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
            <Line type="monotone" dataKey="sentinai" name="SentinAI Multi-Signal Score" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="legacy" name="Legacy Single-Sensor Baseline" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
