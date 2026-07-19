const isDev = import.meta.env.DEV;
const API_BASE = isDev ? 'http://localhost:8000/api' : '/api';
const WS_URL = isDev 
  ? 'ws://localhost:8000/ws/telemetry' 
  : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/telemetry`;

export async function fetchLayout() {
  const res = await fetch(`${API_BASE}/layout`);
  return res.json();
}

export async function fetchPermits() {
  const res = await fetch(`${API_BASE}/permits`);
  return res.json();
}

export async function updatePermitStatus(permit_id, action) {
  const res = await fetch(`${API_BASE}/permits/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ permit_id, action })
  });
  return res.json();
}

export async function setScenario(scenario_id) {
  const res = await fetch(`${API_BASE}/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id })
  });
  return res.json();
}

export async function queryRAG(query, context) {
  const res = await fetch(`${API_BASE}/rag/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, context })
  });
  return res.json();
}

export function connectTelemetryWebSocket(onData) {
  let ws = new WebSocket(WS_URL);
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onData(data);
    } catch (e) {
      console.error(e);
    }
  };

  ws.onerror = (err) => {
    console.warn("ws fallback active", err);
  };

  return ws;
}
