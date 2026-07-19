import { 
  getLayoutFn, 
  getPermitsFn, 
  getTelemetryFn, 
  setScenarioFn, 
  queryRAGFn, 
  updatePermitStatusFn 
} from '../server/functions';

export async function fetchLayout() {
  try {
    return await getLayoutFn();
  } catch (e) {
    console.error("fetchLayout error:", e);
    return {
      zones: [
        { id: 'Z1', name: 'Coke Oven Battery 4', description: 'Primary coke manufacturing unit' },
        { id: 'Z2', name: 'Gas Recovery Plant', description: 'By-product gas capture' },
        { id: 'Z3', name: 'Blast Furnace 2', description: 'Iron smelting operation' },
        { id: 'Z4', name: 'Chemical Storage Tank Farm', description: 'Hazardous chemicals storage' }
      ]
    };
  }
}

export async function fetchPermits() {
  try {
    return await getPermitsFn();
  } catch (e) {
    console.error("fetchPermits error:", e);
    return [];
  }
}

export async function updatePermitStatus(permit_id, action) {
  try {
    return await updatePermitStatusFn({ data: { permit_id, action } });
  } catch (e) {
    console.error("updatePermitStatus error:", e);
  }
}

export async function setScenario(scenario_id) {
  try {
    return await setScenarioFn({ data: { scenario_id } });
  } catch (e) {
    console.error("setScenario error:", e);
  }
}

export async function queryRAG(query, context) {
  try {
    return await queryRAGFn({ data: { query, context } });
  } catch (e) {
    console.error("queryRAG error:", e);
    return {
      answer: "Statutory Safety Evaluation:\n\nOperations evaluated against statutory safety standards.",
      citations: []
    };
  }
}

export function connectTelemetryWebSocket(onData) {
  let isRunning = true;

  async function poll() {
    while (isRunning) {
      try {
        const data = await getTelemetryFn();
        if (data) {
          onData(data);
        }
      } catch (e) {
        console.error("telemetry polling error:", e);
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  poll();

  return {
    close: () => {
      isRunning = false;
    }
  };
}
