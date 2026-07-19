import React, { useState } from 'react';
import { Layers, Activity, Radio, Cpu, Wrench, ShieldCheck } from 'lucide-react';

export default function PlantMap({ layout, telemetry, riskAnalysis }) {
  const [selectedZone, setSelectedZone] = useState(null);

  if (!layout || !layout.zones) return null;

  const sentinaiScore = riskAnalysis?.sentinai_score || 0;
  const isHazardous = sentinaiScore > 50;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Facility Geospatial Safety Map
          </h2>
          <p className="text-xs text-slate-400">Live zone telemetry, worker beacons & equipment schematics</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal</span>
          <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Advisory</span>
          <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Hazard</span>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded overflow-hidden min-h-[400px] p-4 flex items-center justify-center">
        <svg className="w-full h-full max-w-[640px] max-h-[380px]" viewBox="0 0 620 460">
          <defs>
            <radialGradient id="plumeGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </radialGradient>

            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>

          <rect width="620" height="460" fill="url(#grid)" />

          {/* ZONE 1: Coke Oven Battery 4 */}
          <g className="cursor-pointer" onClick={() => setSelectedZone(layout.zones[0])}>
            <rect
              x="60" y="50" width="230" height="170" rx="6"
              fill={isHazardous ? "rgba(239, 68, 68, 0.12)" : "rgba(30, 41, 59, 0.8)"}
              stroke={isHazardous ? "#ef4444" : "#3b82f6"}
              strokeWidth={isHazardous ? "2" : "1.5"}
            />
            <text x="75" y="75" fill="#f8fafc" fontSize="12" fontWeight="700">Coke Oven Battery 4</text>
            <text x="75" y="90" fill="#94a3b8" fontSize="10" fontFamily="monospace">ID: Z1 • 3 Active Sensors</text>

            {/* Battery Structure Graphic */}
            <rect x="75" y="105" width="100" height="45" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <line x1="95" y1="105" x2="95" y2="150" stroke="#475569" strokeWidth="1" />
            <line x1="115" y1="105" x2="115" y2="150" stroke="#475569" strokeWidth="1" />
            <line x1="135" y1="105" x2="135" y2="150" stroke="#475569" strokeWidth="1" />
            <line x1="155" y1="105" x2="155" y2="150" stroke="#475569" strokeWidth="1" />

            {/* Sensor Nodes */}
            <circle cx="85" cy="165" r="4" fill="#00f0ff" />
            <text x="93" y="168" fill="#64748b" fontSize="8" fontFamily="monospace">S-GAS-101</text>

            {/* Permit Badge */}
            <g transform="translate(185, 105)">
              <rect x="0" y="0" width="60" height="18" rx="3" fill="#f59e0b" />
              <text x="30" y="12" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">PTW-HOT</text>
            </g>

            {/* Workers */}
            <g transform="translate(200, 160)">
              <circle r="7" fill="#2563eb" />
              <text y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">W1</text>
            </g>
            <g transform="translate(220, 175)">
              <circle r="7" fill="#2563eb" />
              <text y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">W2</text>
            </g>
          </g>

          {/* Gas Plume Dispersion overlay in Zone 1 during hazard */}
          {isHazardous && (
            <g>
              <ellipse cx="180" cy="140" rx={85 + (telemetry?.gas_ppm || 0)} ry={65 + (telemetry?.gas_ppm || 0) * 0.7} fill="url(#plumeGradient)" />
              <circle cx="180" cy="140" r="4" fill="#ef4444" />
            </g>
          )}

          {/* ZONE 2: Gas Recovery Plant */}
          <g className="cursor-pointer" onClick={() => setSelectedZone(layout.zones[1])}>
            <rect
              x="330" y="50" width="230" height="170" rx="6"
              fill="rgba(30, 41, 59, 0.8)"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <text x="345" y="75" fill="#f8fafc" fontSize="12" fontWeight="700">Gas Recovery Plant</text>
            <text x="345" y="90" fill="#94a3b8" fontSize="10" fontFamily="monospace">ID: Z2 • 2 Active Sensors</text>

            {/* Piping & Scrubber Graphic */}
            <path d="M 345 140 L 410 140 L 410 110 L 460 110" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="410" cy="140" r="14" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
            <text x="410" y="143" fill="#10b981" fontSize="8" textAnchor="middle" fontWeight="bold">SCRUBBER</text>

            {/* Sensor Nodes */}
            <circle cx="355" cy="170" r="4" fill="#10b981" />
            <text x="363" y="173" fill="#64748b" fontSize="8" fontFamily="monospace">S-GAS-201</text>
            <circle cx="440" cy="170" r="4" fill="#10b981" />
            <text x="448" y="173" fill="#64748b" fontSize="8" fontFamily="monospace">S-FLOW-202</text>

            {/* Permit Badge */}
            <g transform="translate(470, 105)">
              <rect x="0" y="0" width="60" height="18" rx="3" fill="#10b981" />
              <text x="30" y="12" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">PTW-ELEC</text>
            </g>

            {/* Worker */}
            <g transform="translate(500, 160)">
              <circle r="7" fill="#2563eb" />
              <text y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">W3</text>
            </g>
          </g>

          {/* ZONE 3: Blast Furnace 2 */}
          <g className="cursor-pointer" onClick={() => setSelectedZone(layout.zones[2])}>
            <rect
              x="60" y="250" width="230" height="170" rx="6"
              fill="rgba(30, 41, 59, 0.8)"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            <text x="75" y="275" fill="#f8fafc" fontSize="12" fontWeight="700">Blast Furnace 2</text>
            <text x="75" y="290" fill="#94a3b8" fontSize="10" fontFamily="monospace">ID: Z3 • 2 Active Sensors</text>

            {/* Furnace Tower Graphic */}
            <polygon points="120,380 140,310 160,310 180,380" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="130" y1="345" x2="170" y2="345" stroke="#3b82f6" strokeWidth="1" />

            {/* Sensor Nodes */}
            <circle cx="85" cy="370" r="4" fill="#3b82f6" />
            <text x="93" y="373" fill="#64748b" fontSize="8" fontFamily="monospace">S-GAS-301</text>
            <circle cx="85" cy="390" r="4" fill="#ef4444" />
            <text x="93" y="393" fill="#64748b" fontSize="8" fontFamily="monospace">S-TEMP-302</text>

            {/* Permit Badge */}
            <g transform="translate(195, 310)">
              <rect x="0" y="0" width="60" height="18" rx="3" fill="#3b82f6" />
              <text x="30" y="12" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">PTW-CONF</text>
            </g>

            {/* Worker */}
            <g transform="translate(225, 365)">
              <circle r="7" fill="#2563eb" />
              <text y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">W4</text>
            </g>
          </g>

          {/* ZONE 4: Chemical Storage Tank Farm */}
          <g className="cursor-pointer" onClick={() => setSelectedZone(layout.zones[3])}>
            <rect
              x="330" y="250" width="230" height="170" rx="6"
              fill="rgba(30, 41, 59, 0.8)"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            <text x="345" y="275" fill="#f8fafc" fontSize="12" fontWeight="700">Chemical Storage Tank Farm</text>
            <text x="345" y="290" fill="#94a3b8" fontSize="10" fontFamily="monospace">ID: Z4 • 2 Active Sensors</text>

            {/* Cylindrical Storage Tanks Graphic */}
            <ellipse cx="380" cy="330" rx="22" ry="12" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <rect x="358" y="330" width="44" height="30" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <ellipse cx="380" cy="360" rx="22" ry="12" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="380" y="348" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">TANK-A1</text>

            <ellipse cx="440" cy="330" rx="22" ry="12" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <rect x="418" y="330" width="44" height="30" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <ellipse cx="440" cy="360" rx="22" ry="12" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="440" y="348" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">TANK-A2</text>

            {/* Sensor Nodes */}
            <circle cx="355" cy="395" r="4" fill="#3b82f6" />
            <text x="363" y="398" fill="#64748b" fontSize="8" fontFamily="monospace">S-GAS-401</text>
            <circle cx="440" cy="395" r="4" fill="#3b82f6" />
            <text x="448" y="398" fill="#64748b" fontSize="8" fontFamily="monospace">S-PRESS-402</text>

            {/* Worker */}
            <g transform="translate(500, 360)">
              <circle r="7" fill="#2563eb" />
              <text y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">W5</text>
            </g>
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded text-[11px] font-mono flex flex-col gap-1 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Plume Model:</span>
            <span>Gaussian Plume Dispersion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Telemetry:</span>
            <span className="text-amber-400 font-bold">CO Gas ({telemetry?.gas_ppm || 0} ppm)</span>
          </div>
        </div>
      </div>

      {selectedZone && (
        <div className="mt-3 bg-slate-950 border border-slate-800 rounded p-3 text-xs flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-100">{selectedZone.name}</span>
            <p className="text-slate-400 text-[11px]">{selectedZone.description}</p>
          </div>
          <button 
            onClick={() => setSelectedZone(null)}
            className="text-slate-400 hover:text-slate-200 px-2 py-1 border border-slate-700 rounded text-xs"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
