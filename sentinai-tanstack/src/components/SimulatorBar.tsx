import React from 'react';
import { Play, CheckCircle2, ShieldAlert, AlertOctagon } from 'lucide-react';
import { setScenario } from '../services/api';

export default function SimulatorBar({ currentScenario, onSelectScenario }) {
  const handleSelect = async (id) => {
    try {
      await setScenario(id);
      onSelectScenario(id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold uppercase text-slate-300 tracking-wide font-mono">Demo Scenario Controls:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Scenario 1 */}
        <button
          onClick={() => handleSelect(1)}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
            currentScenario === 1
              ? 'bg-blue-600 text-white border border-blue-500'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Scenario 1: Baseline Normal</span>
        </button>

        {/* Scenario 2 */}
        <button
          onClick={() => handleSelect(2)}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
            currentScenario === 2
              ? 'bg-amber-600 text-white border border-amber-500'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Scenario 2: Single Sensor Spike</span>
        </button>

        {/* Scenario 3 */}
        <button
          onClick={() => handleSelect(3)}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
            currentScenario === 3
              ? 'bg-red-600 text-white border border-red-500'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Scenario 3: Vizag Cascade (Early Warning)</span>
        </button>
      </div>
    </div>
  );
}
