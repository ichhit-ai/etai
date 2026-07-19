import { createAPIFileRoute } from '@tanstack/react-start/api'
import { setSimulatorScenario } from '../../server/simulator'

export const APIRoute = createAPIFileRoute('/api/scenario')({
  POST: async ({ request }) => {
    const { scenario_id } = await request.json()
    setSimulatorScenario(scenario_id)
    return new Response(JSON.stringify({ status: 'updated' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
