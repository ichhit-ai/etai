import math

# weight parameters for risk signals
WEIGHTS = {
    "gas": 0.35,
    "permit": 0.25,
    "worker_proximity": 0.20,
    "shift_handoff": 0.10,
    "cctv_anomaly": 0.10
}

# correlation sensitivity constant
BETA = 0.85

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def calculate_compound_risk(gas_ppm, permit_risk_score, worker_count, is_shift_handoff, cctv_anomaly_score, active_correlations):
    # normalize individual signal severities (0.0 to 1.0)
    s_gas = min(1.0, gas_ppm / 50.0)
    s_permit = min(1.0, permit_risk_score / 100.0)
    s_worker = min(1.0, worker_count / 5.0)
    s_handoff = 1.0 if is_shift_handoff else 0.0
    s_cctv = min(1.0, cctv_anomaly_score / 100.0)

    weighted_sum = (
        WEIGHTS["gas"] * s_gas +
        WEIGHTS["permit"] * s_permit +
        WEIGHTS["worker_proximity"] * s_worker +
        WEIGHTS["shift_handoff"] * s_handoff +
        WEIGHTS["cctv_anomaly"] * s_cctv
    )

    # calculate correlation multiplier C(z,t)
    c_zt = float(active_correlations)

    # compound risk formula
    raw_score = weighted_sum * (1.0 + BETA * c_zt)
    
    # logistic s-curve scaling
    sentinai_score = round(min(99.9, sigmoid(raw_score * 3.5 - 2.0) * 100.0), 1)

    # legacy single-sensor baseline max threshold
    legacy_score = round(min(99.9, max(s_gas, s_permit) * 100.0), 1)

    return {
        "sentinai_score": sentinai_score,
        "legacy_score": legacy_score,
        "correlation_multiplier": round(c_zt, 2),
        "signals": {
            "gas_severity": round(s_gas, 2),
            "permit_severity": round(s_permit, 2),
            "worker_proximity": round(s_worker, 2),
            "shift_handoff": s_handoff,
            "cctv_anomaly": round(s_cctv, 2)
        }
    }
