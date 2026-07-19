import { createAPIFileRoute } from '@tanstack/react-start/api'
import { queryComplianceAgent } from '../../server/ragEngine'

export const APIRoute = createAPIFileRoute('/api/rag')({
  POST: async ({ request }) => {
    const { query, context } = await request.json()
    const result = await queryComplianceAgent(query, context)
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
