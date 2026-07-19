import { createAPIFileRoute } from '@tanstack/react-start/api'
import fs from 'fs'
import path from 'path'

export const APIRoute = createAPIFileRoute('/api/layout')({
  GET: async () => {
    // Return a mocked layout if we don't have the original JSON file copied
    const layout = {
      zones: [
        { id: 'Z1', name: 'Coke Oven Battery 4', description: 'Primary coke manufacturing unit' },
        { id: 'Z2', name: 'Gas Recovery Plant', description: 'By-product gas capture' },
        { id: 'Z3', name: 'Blast Furnace 2', description: 'Iron smelting operation' },
        { id: 'Z4', name: 'Chemical Storage Tank Farm', description: 'Hazardous chemicals storage' }
      ]
    }
    return new Response(JSON.stringify(layout), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
})
