import asyncio
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.risk_engine import calculate_compound_risk
from app.rag_engine import RegulatoryRAG
from app.simulator import SimulationEngine

app = FastAPI(title="SentinAI Industrial Safety Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_dir = os.path.join(os.path.dirname(__file__), 'data')
simulator = SimulationEngine()
rag = RegulatoryRAG(os.path.join(data_dir, 'oisd_rules.json'))

class ScenarioRequest(BaseModel):
    scenario_id: int

class PermitUpdateRequest(BaseModel):
    permit_id: str
    action: str

class RAGQueryRequest(BaseModel):
    query: str

@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "SentinAI Core"}

@app.get("/api/layout")
def get_layout():
    import json
    with open(os.path.join(data_dir, 'plant_layout.json')) as f:
        return json.load(f)

@app.get("/api/permits")
def get_permits():
    return [
        {
            "id": "PTW-2026-HOT-089",
            "type": "Hot Work (Welding)",
            "zone": "Coke Oven Battery 4",
            "status": "ACTIVE",
            "hazard_flag": "Proximity to CO gas main"
        },
        {
            "id": "PTW-2026-CONF-042",
            "type": "Confined Space Entry",
            "zone": "Blast Furnace 2",
            "status": "ACTIVE",
            "hazard_flag": "Requires oxygen monitoring"
        },
        {
            "id": "PTW-2026-ELEC-112",
            "type": "Electrical Isolation",
            "zone": "Gas Recovery Plant",
            "status": "ACTIVE",
            "hazard_flag": "Standard lockout/tagout"
        }
    ]

@app.post("/api/permits/update")
def update_permit(req: PermitUpdateRequest):
    return {"status": "updated", "permit_id": req.permit_id, "new_status": req.action}

@app.post("/api/scenario")
def set_scenario(req: ScenarioRequest):
    simulator.set_scenario(req.scenario_id)
    return {"status": "scenario_updated", "active_scenario": req.scenario_id}

@app.post("/api/rag/search")
def search_rag(req: RAGQueryRequest):
    context = simulator.generate_tick_data()
    result = rag.query_compliance_agent(req.query, active_context=context)
    return result

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = simulator.generate_tick_data()
            await websocket.send_json(data)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass

# Mount built frontend single-page application for single-server deployment
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/dist'))

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("ws/"):
            return None
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
