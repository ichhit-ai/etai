export function calculateCompoundRisk(
  gasPpm: number,
  permitRiskScore: number,
  workerCount: number,
  isShiftHandoff: boolean,
  cctvAnomalyScore: number,
  activeCorrelations: number
) {
  let rBase = (gasPpm * 0.3) + (permitRiskScore * 0.4) + (cctvAnomalyScore * 0.2) + (workerCount * 5.0);
  
  if (isShiftHandoff) {
    rBase *= 1.25;
  }
  
  const compoundMultiplier = 1.0 + (activeCorrelations * 0.15);
  let rCompound = rBase * compoundMultiplier;
  
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-0.1 * (x - 50)));
  const sentinaiScore = Math.min(100, Math.max(0, sigmoid(rCompound) * 100));
  
  let legacyScore = (gasPpm / 50.0) * 100;
  if (legacyScore > 100) legacyScore = 100;

  return {
    r_base: parseFloat(rBase.toFixed(2)),
    r_compound: parseFloat(rCompound.toFixed(2)),
    sentinai_score: parseFloat(sentinaiScore.toFixed(1)),
    legacy_scada_score: parseFloat(legacyScore.toFixed(1))
  };
}
