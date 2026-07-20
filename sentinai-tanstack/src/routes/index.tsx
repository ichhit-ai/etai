import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PlantMap from '../components/PlantMap';
import RiskHUD from '../components/RiskHUD';
import PermitTable from '../components/PermitTable';
import Telemetry from '../components/Telemetry';
import RAGChat from '../components/RAGChat';
import SimulatorBar from '../components/SimulatorBar';
import LandingHero from '../components/LandingHero';
import KnowledgeGraphInspector from '../components/KnowledgeGraphInspector';
import { fetchLayout, fetchPermits, updatePermitStatus, connectTelemetryWebSocket } from '../services/api';
import { LayoutGrid, SlidersHorizontal, GitFork } from 'lucide-react';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONTROL_ROOM'>('OVERVIEW');
  const [layout, setLayout] = useState(null);
  const [permits, setPermits] = useState([]);
  const [telemetryData, setTelemetryData] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(3);
  const [riskHistory, setRiskHistory] = useState([]);

  useEffect(() => {
    fetchLayout().then(setLayout).catch(console.error);
    fetchPermits().then(setPermits).catch(console.error);

    const ws = connectTelemetryWebSocket((data) => {
      setTelemetryData(data);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setRiskHistory((prev) => {
        const next = [
          ...prev.slice(-20),
          {
            time: timestamp,
            sentinai: data.risk_analysis?.sentinai_score || 0,
            legacy: data.risk_analysis?.legacy_score || 0
          }
        ];
        return next;
      });
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleUpdatePermit = async (id: string, action: string) => {
    try {
      await updatePermitStatus(id, action);
      const updated = await fetchPermits();
      setPermits(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header 
        systemStatus={telemetryData?.zone_status} 
        currentScenario={currentScenario}
        leadTime={telemetryData?.early_lead_time_min}
      />

      {/* Top View Navigation Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 md:px-6 py-2.5 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'OVERVIEW' 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>🌐 SYSTEM OVERVIEW & PILLARS</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTROL_ROOM')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CONTROL_ROOM' 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>🎛️ LIVE SCADA CONTROL ROOM</span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400">
          <GitFork className="w-3.5 h-3.5 text-emerald-400" />
          <span>Knowledge Graph Engine: Active</span>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 space-y-5 max-w-[1600px] mx-auto w-full">
        {activeTab === 'OVERVIEW' ? (
          <LandingHero onLaunchControlRoom={() => setActiveTab('CONTROL_ROOM')} />
        ) : (
          <>
            {/* Simulator Control Bar */}
            <SimulatorBar 
              currentScenario={currentScenario}
              onSelectScenario={setCurrentScenario}
            />

            {/* Top Grid: Geospatial Map & Risk HUD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7">
                <PlantMap 
                  layout={layout} 
                  telemetry={telemetryData?.telemetry} 
                  riskAnalysis={telemetryData?.risk_analysis} 
                />
              </div>
              <div className="lg:col-span-5">
                <RiskHUD 
                  history={riskHistory} 
                  currentRisk={telemetryData?.risk_analysis} 
                />
              </div>
            </div>

            {/* Knowledge Graph Engine Inspector */}
            <KnowledgeGraphInspector telemetry={telemetryData} />

            {/* Bottom Grid: Permit Table, Telemetry, Regulatory RAG */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4">
                <PermitTable 
                  permits={permits} 
                  onUpdateStatus={handleUpdatePermit}
                  riskAnalysis={telemetryData?.risk_analysis}
                />
              </div>
              <div className="lg:col-span-4">
                <Telemetry data={telemetryData} />
              </div>
              <div className="lg:col-span-4">
                <RAGChat telemetry={telemetryData?.telemetry} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
