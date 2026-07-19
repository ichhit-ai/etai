import React from 'react';
import { FileText, Ban } from 'lucide-react';

export default function PermitTable({ permits, onUpdateStatus, riskAnalysis }) {
  if (!permits) return null;

  const sentinaiScore = riskAnalysis?.sentinai_score || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Digital Permit-to-Work (PTW) Index
          </h2>
          <p className="text-xs text-slate-400">Active permits vs. real-time conditions</p>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono">
              <th className="pb-2 font-medium">PERMIT ID</th>
              <th className="pb-2 font-medium">TYPE</th>
              <th className="pb-2 font-medium">ZONE</th>
              <th className="pb-2 font-medium">STATUS</th>
              <th className="pb-2 font-medium text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {permits.map((p) => {
              const isSuspended = p.status === 'SUSPENDED' || p.status === 'REVOKED';
              const isHotWork = p.type.includes('Hot');
              const isHighRiskNow = isHotWork && sentinaiScore > 50;

              return (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-mono font-bold text-slate-200">{p.id}</td>
                  <td className="py-2.5 text-slate-300">
                    <div>{p.type}</div>
                    <span className="text-[10px] text-slate-500">{p.hazard_flag}</span>
                  </td>
                  <td className="py-2.5 text-slate-300">{p.zone}</td>
                  <td className="py-2.5">
                    {isSuspended ? (
                      <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        SUSPENDED
                      </span>
                    ) : isHighRiskNow ? (
                      <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        HIGH RISK
                      </span>
                    ) : (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    {isSuspended ? (
                      <button
                        onClick={() => onUpdateStatus(p.id, 'active')}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-2.5 py-1 rounded text-[11px] font-medium"
                      >
                        Reinstate
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(p.id, 'suspended')}
                        className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 px-2 py-1 rounded text-[11px] font-medium inline-flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" /> Suspend
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
