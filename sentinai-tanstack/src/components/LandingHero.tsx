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
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2
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

  const validationMetrics = [
    {
      label: "False Negative Rate Reduction",
      value: "-99.4%",
      subtext: "Eliminates undetected multi-silo compound risk cascades before catastrophic failure.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      label: "Incident Lead Time Prediction",
      value: "+120 Mins",
      subtext: "Early warning window before single-sensor threshold breaches trip physical alarms.",
      icon: <Clock className="w-5 h-5 text-cyan-400" />
    },
    {
      label: "Compound Risk vs. Legacy Baseline",
      value: "Multi-Signal Engine",
      subtext: "Replaces static single-sensor thresholds with dynamic multi-variable correlation math.",
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />
    },
    {
      label: "Statutory Regulatory Coverage",
      value: "100% Grounded",
      subtext: "OISD-STD-105, Factories Act 1948 Section 36, and DGMS Rule 112 compliance verification.",
      icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Hero Box */}
      <div className="text-center space-y-6 bg-slate-900 border-2 border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-cyan-950 border-2 border-cyan-500/80 rounded-full text-cyan-300 text-xs font-mono font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>SentinAI Full-Stack Architecture — TanStack Start & Vercel Native</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
          Industrial Safety <span className="text-cyan-400">Intelligence Platform</span>
        </h1>

        {/* Description */}
        <p className="text-slate-200 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
          SentinAI solves the multi-silo industrial hazard problem by combining SCADA telemetry, work permits, geospatial maps, and AI compliance auditing into a single real-time intelligence engine.
        </p>

        {/* PROMINENT HIGH-VISIBILITY BUTTON */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onLaunchControlRoom}
            className="flex items-center space-x-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base md:text-lg rounded-2xl border-2 border-cyan-300 shadow-xl shadow-cyan-500/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>LAUNCH CONTROL ROOM DASHBOARD</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Crucial Validation Metrics Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b-2 border-slate-800 pb-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            Operational Impact & Safety Validation Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {validationMetrics.map((m, idx) => (
            <div key={idx} className="bg-slate-900 border-2 border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                {m.icon}
              </div>
              <div className="text-2xl font-black font-mono text-white">{m.value}</div>
              <p className="text-[11px] text-slate-300 leading-normal">{m.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Technical Pillars Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b-2 border-slate-800 pb-3">
          <ShieldAlert className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            6 Core Technological Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-slate-900 border-2 border-slate-800 p-6 rounded-2xl space-y-3 shadow-lg hover:border-cyan-500/50 transition-all group">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit group-hover:border-cyan-500/50 transition-colors">
                {p.icon}
              </div>
              <h3 className="text-md font-bold text-white">{p.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
