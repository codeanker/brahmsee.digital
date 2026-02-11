import { sseManager, type SSEEvent } from './SSEManager.js'

/**
 * Emit a table update event to all subscribed SSE clients
 * @param resource - The resource type (e.g., 'veranstaltung', 'anmeldung', 'person')
 * @param data - Optional additional data to send with the event
 */
export function emitTableUpdate(resource: string, data?: Record<string, unknown>) {
  const event: SSEEvent = {
    type: 'table-update',
    resource,
    data,
  }
  sseManager.broadcast(event)
}

/**
 * Helper to wrap mutations and automatically emit SSE events
 * @param resource - The resource type
 * @param mutationFn - The mutation function to execute
 * @returns The result of the mutation
 */
export async function withSSENotification<T>(
  resource: string,
  mutationFn: () => Promise<T>
): Promise<T> {
  const result = await mutationFn()
  emitTableUpdate(resource)
  return result
}
