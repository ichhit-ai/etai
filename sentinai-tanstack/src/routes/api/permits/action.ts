import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/permits/action')({
  POST: async ({ request }) => {
    const { permit_id, action } = await request.json()
    return new Response(JSON.stringify({ status: 'updated', permit_id, new_status: action }), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
