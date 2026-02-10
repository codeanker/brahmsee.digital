import { makeApp } from '../util/make-app.js'
import { getEntityIdFromHeader } from '../authentication.js'
import { sseManager } from './SSEManager.js'
import { logger } from '../logger.js'
import { randomUUID } from 'crypto'

export const sseRouter = makeApp()

sseRouter.get('/', async (c) => {
  // Authenticate the connection
  const authorization = c.req.header('authorization')
  if (!authorization) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  let accountId: string | undefined
  try {
    accountId = getEntityIdFromHeader(authorization)
  } catch (error) {
    logger.error('SSE authentication failed:', error)
    return c.json({ error: 'Invalid token' }, 401)
  }

  if (!accountId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Generate unique client ID
  const clientId = randomUUID()

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Add client to manager
      sseManager.addClient(clientId, accountId, controller)

      // Send initial connection message
      const message = `event: connected\ndata: ${JSON.stringify({ clientId })}\n\n`
      controller.enqueue(new TextEncoder().encode(message))

      // Send periodic heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = `: heartbeat\n\n`
          controller.enqueue(new TextEncoder().encode(heartbeat))
        } catch (error) {
          clearInterval(heartbeatInterval)
          sseManager.removeClient(clientId)
        }
      }, 30000) // Every 30 seconds

      // Handle client disconnect
      c.req.raw.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        sseManager.removeClient(clientId)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
})

// Subscribe endpoint
sseRouter.post('/subscribe', async (c) => {
  const authorization = c.req.header('authorization')
  if (!authorization) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json<{ clientId: string; resource: string }>()
  const { clientId, resource } = body

  if (!clientId || !resource) {
    return c.json({ error: 'Missing clientId or resource' }, 400)
  }

  sseManager.subscribe(clientId, resource)
  return c.json({ success: true })
})

// Unsubscribe endpoint
sseRouter.post('/unsubscribe', async (c) => {
  const authorization = c.req.header('authorization')
  if (!authorization) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json<{ clientId: string; resource: string }>()
  const { clientId, resource } = body

  if (!clientId || !resource) {
    return c.json({ error: 'Missing clientId or resource' }, 400)
  }

  sseManager.unsubscribe(clientId, resource)
  return c.json({ success: true })
})
