import { createAPIFileRoute } from '@tanstack/react-start/api'
import { generateTickData } from '../../server/simulator'

export const APIRoute = createAPIFileRoute('/api/telemetry')({
  GET: async ({ request }) => {
    const data = generateTickData();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
