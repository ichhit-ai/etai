import React from 'react';
import { Gauge, Wind, Thermometer, Cpu } from 'lucide-react';

export default function Telemetry({ data }) {
  const telemetry = data?.telemetry || {};

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            SCADA & Telemetry Gauges
          </h2>
          <p className="text-xs text-slate-400">Real-time sensor parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
        {/* Gas PPM */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>TOXIC GAS (CO)</span>
            <Wind className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-2">
            <span className={`text-2xl font-bold font-mono ${telemetry.gas_ppm > 20 ? 'text-amber-400' : 'text-slate-100'}`}>
              {telemetry.gas_ppm || 0}
            </span>
            <span className="text-xs text-slate-500 font-mono ml-1">ppm</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
            <div 
              className={`h-full ${telemetry.gas_ppm > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(100, ((telemetry.gas_ppm || 0) / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Vessel Pressure */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PRESSURE</span>
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {telemetry.pressure_bar || 0}
            </span>
            <span className="text-xs text-slate-500 font-mono ml-1">bar</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${Math.min(100, ((telemetry.pressure_bar || 0) / 5) * 100)}%` }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>TEMP</span>
            <Thermometer className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {telemetry.temp_celsius || 0}
            </span>
            <span className="text-xs text-slate-500 font-mono ml-1">°C</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
            <div 
              className="h-full bg-red-500" 
              style={{ width: `${Math.min(100, ((telemetry.temp_celsius || 0) / 70) * 100)}%` }}
            />
          </div>
        </div>

        {/* Shift Handoff */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SHIFT HANDOFF</span>
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="my-2">
            <span className={`text-base font-bold font-mono ${telemetry.shift_handoff ? 'text-amber-400' : 'text-slate-300'}`}>
              {telemetry.shift_handoff ? 'IN PROGRESS' : 'STABLE'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {telemetry.shift_handoff ? 'Shift A ➔ Shift B' : 'Normal'}
          </div>
        </div>
      </div>
    </div>
  );
}
