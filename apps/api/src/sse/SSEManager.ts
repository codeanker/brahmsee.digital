import { logger } from '../logger.js'

export type SSEClient = {
  id: string
  accountId: string
  controller: ReadableStreamDefaultController
  subscriptions: Set<string>
}

export type SSEEvent = {
  type: 'table-update'
  resource: string
  data?: Record<string, unknown>
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map()

  addClient(clientId: string, accountId: string, controller: ReadableStreamDefaultController) {
    const client: SSEClient = {
      id: clientId,
      accountId,
      controller,
      subscriptions: new Set(),
    }
    this.clients.set(clientId, client)
    logger.info(`SSE client connected: ${clientId} (account: ${accountId})`)
    return client
  }

  removeClient(clientId: string) {
    const client = this.clients.get(clientId)
    if (client) {
      this.clients.delete(clientId)
      logger.info(`SSE client disconnected: ${clientId}`)
    }
  }

  subscribe(clientId: string, resource: string) {
    const client = this.clients.get(clientId)
    if (client) {
      client.subscriptions.add(resource)
      logger.debug(`Client ${clientId} subscribed to ${resource}`)
    }
  }

  unsubscribe(clientId: string, resource: string) {
    const client = this.clients.get(clientId)
    if (client) {
      client.subscriptions.delete(resource)
      logger.debug(`Client ${clientId} unsubscribed from ${resource}`)
    }
  }

  broadcast(event: SSEEvent) {
    const { type, resource, data } = event
    let sentCount = 0

    for (const client of this.clients.values()) {
      if (client.subscriptions.has(resource) || client.subscriptions.has('*')) {
        try {
          const message = `event: ${type}\ndata: ${JSON.stringify({ resource, ...data })}\n\n`
          client.controller.enqueue(new TextEncoder().encode(message))
          sentCount++
        } catch (error) {
          logger.error(`Failed to send SSE to client ${client.id}:`, error)
          this.removeClient(client.id)
        }
      }
    }

    if (sentCount > 0) {
      logger.debug(`Broadcasted ${type} event for ${resource} to ${sentCount} clients`)
    }
  }

  sendToClient(clientId: string, event: SSEEvent) {
    const client = this.clients.get(clientId)
    if (!client) {
      logger.warn(`Attempted to send to non-existent client: ${clientId}`)
      return
    }

    try {
      const { type, resource, data } = event
      const message = `event: ${type}\ndata: ${JSON.stringify({ resource, ...data })}\n\n`
      client.controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      logger.error(`Failed to send SSE to client ${clientId}:`, error)
      this.removeClient(clientId)
    }
  }

  getClientCount(): number {
    return this.clients.size
  }

  getClients(): SSEClient[] {
    return Array.from(this.clients.values())
  }
}

export const sseManager = new SSEManager()
