/**
 * SentinAI Validation Engine
 * 
 * Runs 120 synthetic scenarios across 3 profiles (Baseline, Single-Spike, Cascade)
 * and computes a real confusion matrix comparing SentinAI compound detection
 * vs. a legacy single-sensor threshold system.
 * 
 * Ground truth labels are derived from scenario design:
 *   - Scenario 1 (Baseline Normal): TRUE_SAFE across all ticks
 *   - Scenario 2 (Single Spike): TRUE_HAZARD only during spike window (tick 30-45)
 *   - Scenario 3 (Vizag Cascade): TRUE_HAZARD once compound conditions converge (tick > 20)
 */

import { calculateCompoundRisk } from './riskEngine';

interface ScenarioTick {
  tick: number;
  gasPpm: number;
  permitRisk: number;
  workerCount: number;
  shiftHandoff: boolean;
  cctvAnomaly: number;
  correlations: number;
  groundTruth: 'SAFE' | 'HAZARD';
}

interface DetectionResult {
  tick: number;
  groundTruth: 'SAFE' | 'HAZARD';
  sentinaiScore: number;
  legacyScore: number;
  sentinaiPrediction: 'SAFE' | 'HAZARD';
  legacyPrediction: 'SAFE' | 'HAZARD';
}

interface ConfusionMatrix {
  truePositive: number;
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
}

export interface ValidationReport {
  totalScenarios: number;
  totalTicks: number;
  sentinai: {
    confusionMatrix: ConfusionMatrix;
    accuracy: number;
    precision: number;
    recall: number;
    falseNegativeRate: number;
    f1Score: number;
    firstDetectionTick: number | null;
  };
  legacy: {
    confusionMatrix: ConfusionMatrix;
    accuracy: number;
    precision: number;
    recall: number;
    falseNegativeRate: number;
    f1Score: number;
    firstDetectionTick: number | null;
  };
  leadTimeAdvantage: number;
  falseNegativeReduction: number;
  detectionResults: DetectionResult[];
}

const SENTINAI_THRESHOLD = 45;
const LEGACY_THRESHOLD = 50;

function generateScenario1Ticks(): ScenarioTick[] {
  // Baseline Normal: 120 ticks, all safe. Low gas, low permits, stable.
  const ticks: ScenarioTick[] = [];
  for (let t = 0; t < 120; t++) {
    ticks.push({
      tick: t,
      gasPpm: 5.0 + (t % 3) * 0.5 + Math.sin(t * 0.1) * 2,
      permitRisk: 15 + Math.sin(t * 0.05) * 5,
      workerCount: 2,
      shiftHandoff: false,
      cctvAnomaly: 3 + Math.random() * 4,
      correlations: 0,
      groundTruth: 'SAFE'
    });
  }
  return ticks;
}

function generateScenario2Ticks(): ScenarioTick[] {
  // Single Sensor Spike: Gas spikes at tick 30-45 but NO compound factors.
  // Legacy SHOULD catch this. SentinAI should also catch it.
  // Ground truth: HAZARD during spike only.
  const ticks: ScenarioTick[] = [];
  for (let t = 0; t < 120; t++) {
    const inSpike = t >= 30 && t <= 45;
    ticks.push({
      tick: t,
      gasPpm: inSpike ? 42 + Math.random() * 8 : 6 + Math.random() * 3,
      permitRisk: 10,
      workerCount: 1,
      shiftHandoff: false,
      cctvAnomaly: 5,
      correlations: 0,
      groundTruth: inSpike ? 'HAZARD' : 'SAFE'
    });
  }
  return ticks;
}

function generateScenario3Ticks(): ScenarioTick[] {
  // Vizag Cascade: Gas rises slowly, permits escalate, shift handoff starts,
  // CCTV anomaly increases. Each factor ALONE is below threshold.
  // Ground truth: HAZARD once compound conditions converge (tick > 20).
  const ticks: ScenarioTick[] = [];
  for (let t = 0; t < 120; t++) {
    const gasPpm = Math.min(38, 8 + t * 0.25 + Math.sin(t * 0.15) * 3);
    const permitRisk = t > 15 ? 75 + Math.sin(t * 0.1) * 10 : 10;
    const workerCount = t > 40 ? 4 : 2;
    const shiftHandoff = t >= 50 && t <= 85;
    const cctvAnomaly = t > 30 ? Math.min(85, t * 0.65 + Math.random() * 5) : 5;

    let correlations = 0;
    if (t > 15) correlations++;
    if (t > 30) correlations++;
    if (t > 40) correlations++;
    if (shiftHandoff) correlations++;

    // Ground truth: compound hazard exists once multiple factors converge
    // Gas is sub-threshold (<50 ppm) so legacy WON'T catch it
    // But the combination of permit + gas + workers + CCTV = real danger
    const groundTruth: 'SAFE' | 'HAZARD' = t > 20 ? 'HAZARD' : 'SAFE';

    ticks.push({
      tick: t,
      gasPpm,
      permitRisk,
      workerCount,
      shiftHandoff,
      cctvAnomaly,
      correlations,
      groundTruth
    });
  }
  return ticks;
}

// Additional scenario variants for robustness
function generateScenario4Ticks(): ScenarioTick[] {
  // Gradual Permit Escalation: permits escalate without gas spike.
  // Tests whether SentinAI catches permit-driven risk that legacy ignores.
  const ticks: ScenarioTick[] = [];
  for (let t = 0; t < 120; t++) {
    const permitRisk = Math.min(95, 10 + t * 0.7);
    const workerCount = t > 30 ? 3 : 1;
    ticks.push({
      tick: t,
      gasPpm: 8 + Math.random() * 4, // gas stays low
      permitRisk,
      workerCount,
      shiftHandoff: t >= 60 && t <= 90,
      cctvAnomaly: t > 50 ? 40 + Math.random() * 20 : 5,
      correlations: (t > 30 ? 1 : 0) + (t > 50 ? 1 : 0) + (t > 60 ? 1 : 0),
      groundTruth: t > 35 ? 'HAZARD' : 'SAFE'
    });
  }
  return ticks;
}

function generateScenario5Ticks(): ScenarioTick[] {
  // CCTV-Only Anomaly: visual anomaly spikes but gas/pressure normal.
  // Tests multi-modal detection.
  const ticks: ScenarioTick[] = [];
  for (let t = 0; t < 120; t++) {
    ticks.push({
      tick: t,
      gasPpm: 5 + Math.random() * 3,
      permitRisk: 20,
      workerCount: t > 40 ? 5 : 2,
      shiftHandoff: false,
      cctvAnomaly: t > 25 ? Math.min(90, 10 + t * 0.8) : 5,
      correlations: (t > 25 ? 1 : 0) + (t > 40 ? 1 : 0),
      groundTruth: t > 30 ? 'HAZARD' : 'SAFE'
    });
  }
  return ticks;
}

function computeConfusionMatrix(results: DetectionResult[], system: 'sentinai' | 'legacy'): ConfusionMatrix {
  let tp = 0, tn = 0, fp = 0, fn = 0;

  for (const r of results) {
    const prediction = system === 'sentinai' ? r.sentinaiPrediction : r.legacyPrediction;
    if (r.groundTruth === 'HAZARD' && prediction === 'HAZARD') tp++;
    else if (r.groundTruth === 'SAFE' && prediction === 'SAFE') tn++;
    else if (r.groundTruth === 'SAFE' && prediction === 'HAZARD') fp++;
    else if (r.groundTruth === 'HAZARD' && prediction === 'SAFE') fn++;
  }

  return { truePositive: tp, trueNegative: tn, falsePositive: fp, falseNegative: fn };
}

function findFirstDetection(results: DetectionResult[], system: 'sentinai' | 'legacy'): number | null {
  for (const r of results) {
    if (r.groundTruth === 'HAZARD') {
      const prediction = system === 'sentinai' ? r.sentinaiPrediction : r.legacyPrediction;
      if (prediction === 'HAZARD') return r.tick;
    }
  }
  return null;
}

export function runValidation(): ValidationReport {
  const allScenarios = [
    ...generateScenario1Ticks(),
    ...generateScenario2Ticks(),
    ...generateScenario3Ticks(),
    ...generateScenario4Ticks(),
    ...generateScenario5Ticks()
  ];

  const results: DetectionResult[] = allScenarios.map(tick => {
    const risk = calculateCompoundRisk(
      tick.gasPpm,
      tick.permitRisk,
      tick.workerCount,
      tick.shiftHandoff,
      tick.cctvAnomaly,
      tick.correlations
    );

    return {
      tick: tick.tick,
      groundTruth: tick.groundTruth,
      sentinaiScore: risk.sentinai_score,
      legacyScore: risk.legacy_scada_score,
      sentinaiPrediction: risk.sentinai_score >= SENTINAI_THRESHOLD ? 'HAZARD' : 'SAFE',
      legacyPrediction: risk.legacy_scada_score >= LEGACY_THRESHOLD ? 'HAZARD' : 'SAFE'
    };
  });

  const sentinaiCM = computeConfusionMatrix(results, 'sentinai');
  const legacyCM = computeConfusionMatrix(results, 'legacy');

  const sentinaiAccuracy = (sentinaiCM.truePositive + sentinaiCM.trueNegative) / results.length;
  const legacyAccuracy = (legacyCM.truePositive + legacyCM.trueNegative) / results.length;

  const sentinaiPrecision = sentinaiCM.truePositive / Math.max(1, sentinaiCM.truePositive + sentinaiCM.falsePositive);
  const legacyPrecision = legacyCM.truePositive / Math.max(1, legacyCM.truePositive + legacyCM.falsePositive);

  const sentinaiRecall = sentinaiCM.truePositive / Math.max(1, sentinaiCM.truePositive + sentinaiCM.falseNegative);
  const legacyRecall = legacyCM.truePositive / Math.max(1, legacyCM.truePositive + legacyCM.falseNegative);

  const sentinaiF1 = 2 * (sentinaiPrecision * sentinaiRecall) / Math.max(0.001, sentinaiPrecision + sentinaiRecall);
  const legacyF1 = 2 * (legacyPrecision * legacyRecall) / Math.max(0.001, legacyPrecision + legacyRecall);

  const sentinaieFNR = sentinaiCM.falseNegative / Math.max(1, sentinaiCM.truePositive + sentinaiCM.falseNegative);
  const legacyFNR = legacyCM.falseNegative / Math.max(1, legacyCM.truePositive + legacyCM.falseNegative);

  // Lead time: find first true-hazard detection tick in Scenario 3 (cascade)
  const scenario3Results = results.slice(240, 360); // Scenario 3 is ticks 240-359
  const sentinaiFirstDetect = findFirstDetection(scenario3Results, 'sentinai');
  const legacyFirstDetect = findFirstDetection(scenario3Results, 'legacy');

  const leadTimeAdvantage = (legacyFirstDetect !== null && sentinaiFirstDetect !== null)
    ? legacyFirstDetect - sentinaiFirstDetect
    : (sentinaiFirstDetect !== null ? 120 : 0);

  const falseNegativeReduction = legacyFNR > 0
    ? ((legacyFNR - sentinaieFNR) / legacyFNR) * 100
    : 0;

  return {
    totalScenarios: 5,
    totalTicks: results.length,
    sentinai: {
      confusionMatrix: sentinaiCM,
      accuracy: parseFloat((sentinaiAccuracy * 100).toFixed(1)),
      precision: parseFloat((sentinaiPrecision * 100).toFixed(1)),
      recall: parseFloat((sentinaiRecall * 100).toFixed(1)),
      falseNegativeRate: parseFloat((sentinaieFNR * 100).toFixed(1)),
      f1Score: parseFloat((sentinaiF1 * 100).toFixed(1)),
      firstDetectionTick: sentinaiFirstDetect
    },
    legacy: {
      confusionMatrix: legacyCM,
      accuracy: parseFloat((legacyAccuracy * 100).toFixed(1)),
      precision: parseFloat((legacyPrecision * 100).toFixed(1)),
      recall: parseFloat((legacyRecall * 100).toFixed(1)),
      falseNegativeRate: parseFloat((legacyFNR * 100).toFixed(1)),
      f1Score: parseFloat((legacyF1 * 100).toFixed(1)),
      firstDetectionTick: legacyFirstDetect
    },
    leadTimeAdvantage,
    falseNegativeReduction: parseFloat(falseNegativeReduction.toFixed(1)),
    detectionResults: results
  };
}
