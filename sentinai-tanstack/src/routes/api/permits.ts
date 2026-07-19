import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/permits')({
  GET: async () => {
    const permits = [
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
    return new Response(JSON.stringify(permits), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
