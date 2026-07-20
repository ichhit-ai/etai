import React, { useState, useEffect } from 'react';
import { GitFork, ShieldAlert, Cpu, FileText, AlertOctagon, RefreshCw } from 'lucide-react';
import { getKnowledgeGraphFn } from '../server/functions';

export default function KnowledgeGraphInspector({ telemetry }: { telemetry: any }) {
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    getKnowledgeGraphFn({ data: { telemetry } })
      .then(setGraphData)
      .catch(console.error);
  }, [telemetry]);

  if (!graphData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-center h-96 text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading Knowledge Graph Engine...
      </div>
    );
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'ASSET': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'PERMIT': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'SENSOR': return <GitFork className="w-4 h-4 text-emerald-400" />;
      case 'HAZARD': return <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'RULE': return <ShieldAlert className="w-4 h-4 text-blue-400" />;
      default: return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
              KNOWLEDGE GRAPH ENGINE <span className="text-xs px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded-full font-mono">ACTIVE TRAVERSAL</span>
            </h3>
            <p className="text-xs text-slate-400">Relational topology linking Plant Assets ↔ Permits ↔ Telemetry ↔ Statutory Rules</p>
          </div>
        </div>

        <div className="flex space-x-3 text-xs font-mono text-slate-300">
          <div className="px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
            Nodes: <span className="text-cyan-400 font-bold">{graphData.nodeCount}</span>
          </div>
          <div className="px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700">
            Edges: <span className="text-cyan-400 font-bold">{graphData.edgeCount}</span>
          </div>
        </div>
      </div>

      {/* SVG Graph Canvas */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden h-[420px] flex items-center justify-center">
        <svg className="w-full h-full min-w-[650px]" viewBox="0 0 650 600">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* Render Edges */}
          {graphData.edges.map((edge: any, idx: number) => {
            const sourceNode = graphData.nodes.find((n: any) => n.id === edge.source);
            const targetNode = graphData.nodes.find((n: any) => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            return (
              <g key={idx}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={edge.active ? '#f43f5e' : '#334155'}
                  strokeWidth={edge.active ? 2.5 : 1.5}
                  strokeDasharray={edge.active ? '4 2' : 'none'}
                  markerEnd={edge.active ? 'url(#arrow-active)' : 'url(#arrow)'}
                  className={edge.active ? 'animate-pulse' : ''}
                />
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2 - 6}
                  fill={edge.active ? '#fda4af' : '#64748b'}
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {edge.relation}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {graphData.nodes.map((node: any) => {
            const isSelected = selectedNode?.id === node.id;
            let fillBg = '#0f172a';
            let strokeColor = '#334155';

            if (node.status === 'CRITICAL') {
              fillBg = '#450a0a';
              strokeColor = '#f43f5e';
            } else if (node.status === 'WARNING') {
              fillBg = '#451a03';
              strokeColor = '#f59e0b';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-all transform hover:scale-105"
              >
                <rect
                  x="-65"
                  y="-22"
                  width="130"
                  height="44"
                  rx="10"
                  fill={fillBg}
                  stroke={isSelected ? '#38bdf8' : strokeColor}
                  strokeWidth={isSelected ? '3' : '1.5'}
                />
                <foreignObject x="-60" y="-18" width="120" height="36">
                  <div className="flex items-center space-x-1.5 h-full px-1">
                    {getNodeIcon(node.type)}
                    <span className="text-[10px] font-semibold text-slate-200 truncate">{node.label}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active Graph Pathway Banner */}
      {graphData.activeRiskPathways?.length > 0 && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
            <span className="font-semibold">CRITICAL GRAPH TRAVERSAL PATHWAY DETECTED:</span>
          </div>
          <code className="font-mono text-[11px] text-rose-200">{graphData.activeRiskPathways[0]}</code>
        </div>
      )}
    </div>
  );
}
