import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function RiskHUD({ history, currentRisk }) {
  const sentinaiScore = currentRisk?.sentinai_score || 0;
  const legacyScore = currentRisk?.legacy_score || 0;
  const multiplier = currentRisk?.correlation_multiplier || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Risk Engine Telemetry Comparison
          </h2>
          <p className="text-xs text-slate-400">Early warning lead time HUD</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded text-xs font-mono">
          <span className="text-slate-400">Correlation C(z,t): </span>
          <span className="text-blue-400 font-bold">{multiplier}x</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold uppercase tracking-wider">SentinAI Risk Score</span>
            <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded font-mono">MULTI-SIGNAL</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono ${sentinaiScore > 75 ? 'text-red-400' : sentinaiScore > 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {sentinaiScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {sentinaiScore > 75 ? 'Critical compound warning' : 'Normal range'}
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider">Legacy Threshold</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">SINGLE-SENSOR</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-300">
              {legacyScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Single threshold score</p>
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
            <Line type="monotone" dataKey="sentinai" name="SentinAI Score" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="legacy" name="Legacy Baseline" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
