import React, { useState, useEffect } from 'react';
import { FlaskConical, ShieldCheck, ShieldAlert, AlertTriangle, Clock, TrendingUp, BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { runValidationFn } from '../server/functions';

export default function ValidationDashboard() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runValidation = async () => {
    setLoading(true);
    try {
      const result = await runValidationFn();
      setReport(result);
    } catch (e) {
      console.error("Validation error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, []);

  if (loading || !report) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-center justify-center">
        <FlaskConical className="w-5 h-5 text-cyan-400 animate-spin mr-3" />
        <span className="text-slate-300 font-mono text-sm">Running validation across {loading ? '600' : '...'} scenario ticks...</span>
      </div>
    );
  }

  const s = report.sentinai;
  const l = report.legacy;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-500/10 border border-violet-500/30 rounded-lg text-violet-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              VALIDATION ENGINE — CONFUSION MATRIX ANALYSIS
              <span className="text-xs px-2 py-0.5 bg-violet-950 text-violet-400 border border-violet-800/50 rounded-full font-mono">COMPUTED</span>
            </h3>
            <p className="text-xs text-slate-400">
              {report.totalScenarios} scenarios × 120 ticks = {report.totalTicks} data points evaluated
            </p>
          </div>
        </div>

        <button
          onClick={runValidation}
          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
        >
          Re-Run Validation
        </button>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          label="False Negative Reduction"
          value={`-${report.falseNegativeReduction}%`}
          subtext={`SentinAI FNR: ${s.falseNegativeRate}% vs Legacy: ${l.falseNegativeRate}%`}
          color="emerald"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          label="Detection Lead Time"
          value={`+${report.leadTimeAdvantage} ticks`}
          subtext={`SentinAI: tick ${s.firstDetectionTick ?? 'N/A'} vs Legacy: tick ${l.firstDetectionTick ?? 'NEVER'}`}
          color="cyan"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
          label="SentinAI F1 Score"
          value={`${s.f1Score}%`}
          subtext={`Precision: ${s.precision}% · Recall: ${s.recall}%`}
          color="amber"
        />
        <MetricCard
          icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
          label="Accuracy Comparison"
          value={`${s.accuracy}%`}
          subtext={`SentinAI: ${s.accuracy}% vs Legacy: ${l.accuracy}%`}
          color="blue"
        />
      </div>

      {/* Side-by-Side Confusion Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfusionMatrixCard
          title="SentinAI (Multi-Signal)"
          cm={s.confusionMatrix}
          accent="cyan"
          recall={s.recall}
          fnr={s.falseNegativeRate}
        />
        <ConfusionMatrixCard
          title="Legacy (Single-Sensor)"
          cm={l.confusionMatrix}
          accent="slate"
          recall={l.recall}
          fnr={l.falseNegativeRate}
        />
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, subtext, color }: any) {
  return (
    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-black font-mono text-white">{value}</div>
      <p className="text-[10px] text-slate-400 leading-snug">{subtext}</p>
    </div>
  );
}

function ConfusionMatrixCard({ title, cm, accent, recall, fnr }: any) {
  const borderColor = accent === 'cyan' ? 'border-cyan-800/50' : 'border-slate-800';
  const headerBg = accent === 'cyan' ? 'bg-cyan-950/50' : 'bg-slate-900';

  return (
    <div className={`border ${borderColor} rounded-xl overflow-hidden`}>
      <div className={`${headerBg} px-4 py-2.5 flex items-center justify-between`}>
        <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
        <div className="flex items-center space-x-3 text-[10px] font-mono">
          <span className="text-emerald-400">Recall: {recall}%</span>
          <span className="text-rose-400">FNR: {fnr}%</span>
        </div>
      </div>
      <div className="p-4">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr>
              <th className="text-left text-slate-500 pb-2"></th>
              <th className="text-center text-slate-400 pb-2 font-bold">Predicted HAZARD</th>
              <th className="text-center text-slate-400 pb-2 font-bold">Predicted SAFE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-slate-400 pr-3 py-2 font-bold">Actual HAZARD</td>
              <td className="text-center py-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-bold text-sm">{cm.truePositive}</span>
                </span>
              </td>
              <td className="text-center py-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/50">
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-300 font-bold text-sm">{cm.falseNegative}</span>
                </span>
              </td>
            </tr>
            <tr>
              <td className="text-slate-400 pr-3 py-2 font-bold">Actual SAFE</td>
              <td className="text-center py-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/50">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300 font-bold text-sm">{cm.falsePositive}</span>
                </span>
              </td>
              <td className="text-center py-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-bold text-sm">{cm.trueNegative}</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
