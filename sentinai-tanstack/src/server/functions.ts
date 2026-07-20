import { createServerFn } from '@tanstack/react-start'
import { generateTickData, setSimulatorScenario } from './simulator'
import { queryComplianceAgent } from './ragEngine'
import { knowledgeGraph } from './knowledgeGraph'

export const getLayoutFn = createServerFn({ method: 'GET' }).handler(async () => {
  return {
    zones: [
      { id: 'Z1', name: 'Coke Oven Battery 4', description: 'Primary coke manufacturing unit' },
      { id: 'Z2', name: 'Gas Recovery Plant', description: 'By-product gas capture' },
      { id: 'Z3', name: 'Blast Furnace 2', description: 'Iron smelting operation' },
      { id: 'Z4', name: 'Chemical Storage Tank Farm', description: 'Hazardous chemicals storage' }
    ]
  }
})

export const getPermitsFn = createServerFn({ method: 'GET' }).handler(async () => {
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
})

export const getTelemetryFn = createServerFn({ method: 'GET' }).handler(async () => {
  return generateTickData()
})

export const getKnowledgeGraphFn = createServerFn({ method: 'POST' })
  .validator((data: { telemetry?: any }) => data)
  .handler(async ({ data }) => {
    return knowledgeGraph.getGraphState(data.telemetry)
  })

export const setScenarioFn = createServerFn({ method: 'POST' })
  .validator((data: { scenario_id: number }) => data)
  .handler(async ({ data }) => {
    setSimulatorScenario(data.scenario_id)
    return { status: 'updated', scenario: data.scenario_id }
  })

export const queryRAGFn = createServerFn({ method: 'POST' })
  .validator((data: { query: string; context?: any }) => data)
  .handler(async ({ data }) => {
    return await queryComplianceAgent(data.query, data.context)
  })

export const updatePermitStatusFn = createServerFn({ method: 'POST' })
  .validator((data: { permit_id: string; action: string }) => data)
  .handler(async ({ data }) => {
    return { status: 'updated', permit_id: data.permit_id, new_status: data.action }
  })
