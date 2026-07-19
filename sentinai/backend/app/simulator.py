import asyncio
from app.risk_engine import calculate_compound_risk

class SimulationEngine:
    def __init__(self):
        self.scenario = 3  # default scenario 3 (vizag cascade)
        self.tick = 0
        self.max_ticks = 120
        self.is_running = True

    def set_scenario(self, scenario_id):
        self.scenario = scenario_id
        self.tick = 0

    def generate_tick_data(self):
        self.tick = (self.tick + 1) % self.max_ticks
        t = self.tick

        if self.scenario == 1:
            # baseline normal operations
            gas_ppm = 5.0 + (t % 3) * 0.5
            permit_risk = 20.0
            worker_count = 2
            shift_handoff = False
            cctv_anomaly = 5.0
            correlations = 0

        elif self.scenario == 2:
            # single sensor false alarm spike
            gas_ppm = 45.0 if 30 <= t <= 45 else 6.0
            permit_risk = 10.0
            worker_count = 1
            shift_handoff = False
            cctv_anomaly = 0.0
            correlations = 0

        else:
            # scenario 3: vizag disaster cascade
            # slow gas pressure drop & toxic gas accumulation
            gas_ppm = min(42.0, 8.0 + (t * 0.3))
            
            # active hot work welding permit near gas line
            permit_risk = 85.0 if t > 15 else 10.0
            
            # workers present in confined zone
            worker_count = 4 if t > 40 else 2
            
            # shift handoff window at t=60..80
            shift_handoff = True if 50 <= t <= 85 else False
            
            cctv_anomaly = min(90.0, t * 0.7) if t > 30 else 5.0
            
            # correlation multiplier count increases as factors overlap
            correlations = 0
            if t > 15: correlations += 1 # permit active near gas
            if t > 40: correlations += 1 # worker proximity
            if 50 <= t <= 85: correlations += 1 # shift handoff window
            if t > 70: correlations += 1 # plume migration

        risk_eval = calculate_compound_risk(
            gas_ppm=gas_ppm,
            permit_risk_score=permit_risk,
            worker_count=worker_count,
            is_shift_handoff=shift_handoff,
            cctv_anomaly_score=cctv_anomaly,
            active_correlations=correlations
        )

        # zone 1 specific status
        status = "NORMAL"
        if risk_eval["sentinai_score"] > 75:
            status = "CRITICAL_COMPOUND_HAZARD"
        elif risk_eval["sentinai_score"] > 45:
            status = "ADVISORY_WARNING"

        return {
            "tick": t,
            "scenario": self.scenario,
            "timestamp_offset_min": t,
            "telemetry": {
                "gas_ppm": round(gas_ppm, 1),
                "pressure_bar": round(max(1.2, 4.5 - (t * 0.025)), 2),
                "temp_celsius": round(42.0 + (t * 0.15), 1),
                "workers_count": worker_count,
                "active_permit": "PTW-2026-HOT-089" if permit_risk > 50 else "NONE",
                "shift_handoff": shift_handoff
            },
            "risk_analysis": risk_eval,
            "zone_status": status,
            "early_lead_time_min": max(0, 120 - t) if risk_eval["sentinai_score"] > 60 else 0
        }
