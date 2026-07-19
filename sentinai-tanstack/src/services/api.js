const API_BASE = '/api';

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
  const res = await fetch(`${API_BASE}/rag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, context })
  });
  return res.json();
}

// Convert WebSocket to Polling for Vercel/TanStack Serverless compatibility
export function connectTelemetryWebSocket(onData) {
  let isRunning = true;
  
  async function poll() {
    while(isRunning) {
      try {
        const res = await fetch(`${API_BASE}/telemetry`);
        const data = await res.json();
        onData(data);
      } catch(e) {
        console.error(e);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  poll();
  
  return {
    close: () => { isRunning = false; }
  };
}
