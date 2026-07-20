import React from 'react';
import { 
  ShieldAlert, 
  Bot, 
  GitFork, 
  MapPin, 
  BookOpen, 
  Eye, 
  Activity, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function LandingHero({ onLaunchControlRoom }: { onLaunchControlRoom: () => void }) {
  const pillars = [
    {
      icon: <Bot className="w-6 h-6 text-cyan-400" />,
      title: "Agentic AI / Multi-Agent Systems",
      desc: "Autonomous safety monitoring & statutory compliance AI agents collaborating in real time."
    },
    {
      icon: <GitFork className="w-6 h-6 text-emerald-400" />,
      title: "Knowledge Graph Engine",
      desc: "Relational graph topology mapping Equipment ↔ Work Permits ↔ Sensors ↔ Legal Safety Rules."
    },
    {
      icon: <MapPin className="w-6 h-6 text-amber-400" />,
      title: "Geospatial & Layout Analytics",
      desc: "Vectorized industrial GIS schematics tracking worker beacons and toxic gas plume dispersion."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      title: "Statutory RAG Intelligence",
      desc: "Zero-trust legal groundtruth index referencing OISD-STD-105, Factories Act 1948 & DGMS rules."
    },
    {
      icon: <Eye className="w-6 h-6 text-rose-400" />,
      title: "Computer Vision CCTV Analytics",
      desc: "Multi-modal visual anomaly scoring for PPE compliance, worker clustering & zone breaches."
    },
    {
      icon: <Activity className="w-6 h-6 text-violet-400" />,
      title: "IoT / SCADA Telemetry Stream",
      desc: "High-frequency sensor pipeline monitoring gas PPM, pressure, temperature, and SIMOPS risks."
    }
  ];

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-5 bg-slate-900/60 border border-slate-800 p-8 md:p-12 rounded-3xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-950/80 border border-cyan-800/60 rounded-full text-cyan-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SentinAI Full-Stack Architecture — TanStack Start & Vercel Native</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-400 leading-tight">
          Industrial Safety Intelligence Platform
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          SentinAI solves the multi-silo industrial hazard problem by combining SCADA telemetry, work permits, geospatial maps, and AI compliance auditing into a single real-time intelligence engine.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onLaunchControlRoom}
            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105 cursor-pointer"
          >
            <span>LAUNCH CONTROL ROOM DASHBOARD</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 6 Technical Pillars Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-slate-200 uppercase tracking-wide">
            6 Core Technological Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800/80 p-6 rounded-2xl space-y-3 hover:border-slate-700 transition-all hover:shadow-xl group">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="text-md font-bold text-slate-100">{p.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
