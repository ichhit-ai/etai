import { calculateCompoundRisk } from './riskEngine';

let currentScenario = 3;
let currentTick = 0;
const maxTicks = 120;

export function setSimulatorScenario(scenarioId: number) {
  currentScenario = scenarioId;
  currentTick = 0;
}

export function generateTickData() {
  currentTick = (currentTick + 1) % maxTicks;
  const t = currentTick;
  
  let gasPpm = 0, permitRisk = 0, workerCount = 0, shiftHandoff = false, cctvAnomaly = 0, correlations = 0;
  
  if (currentScenario === 1) {
    gasPpm = 5.0 + (t % 3) * 0.5;
    permitRisk = 20.0;
    workerCount = 2;
  } else if (currentScenario === 2) {
    gasPpm = (t >= 30 && t <= 45) ? 45.0 : 6.0;
    permitRisk = 10.0;
    workerCount = 1;
  } else {
    gasPpm = Math.min(42.0, 8.0 + (t * 0.3));
    permitRisk = t > 15 ? 85.0 : 10.0;
    workerCount = t > 40 ? 4 : 2;
    shiftHandoff = (t >= 50 && t <= 85);
    cctvAnomaly = t > 30 ? Math.min(90.0, t * 0.7) : 5.0;
    
    if (t > 15) correlations++;
    if (t > 40) correlations++;
    if (shiftHandoff) correlations++;
    if (t > 70) correlations++;
  }

  const riskEval = calculateCompoundRisk(gasPpm, permitRisk, workerCount, shiftHandoff, cctvAnomaly, correlations);
  
  let status = "NORMAL";
  if (riskEval.sentinai_score > 75) status = "CRITICAL_COMPOUND_HAZARD";
  else if (riskEval.sentinai_score > 45) status = "ADVISORY_WARNING";

  return {
    tick: t,
    scenario: currentScenario,
    telemetry: {
      gas_ppm: Number(gasPpm.toFixed(1)),
      pressure_bar: Number(Math.max(1.2, 4.5 - (t * 0.025)).toFixed(2)),
      temp_celsius: Number((42.0 + (t * 0.15)).toFixed(1)),
      workers_count: workerCount,
      active_permit: permitRisk > 50 ? "PTW-2026-HOT-089" : "NONE",
      shift_handoff: shiftHandoff
    },
    risk_analysis: riskEval,
    zone_status: status,
    early_lead_time_min: riskEval.sentinai_score > 60 ? Math.max(0, 120 - t) : 0
  };
}
