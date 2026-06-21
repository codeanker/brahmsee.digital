import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export type SSEEventType = 'table-update'

export type SSEEventCallback = (data: {
  resource: string
  [key: string]: unknown
}) => void

const host = import.meta.env[`VITE_APP_API_HOST`] || ''

class SSEService {
  private eventSource: EventSource | null = null
  private clientId: string | null = null
  private listeners: Map<string, Set<SSEEventCallback>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isConnected = ref(false)
  private isConnecting = ref(false)

  get connected(): Ref<boolean> {
    return this.isConnected
  }

  get connecting(): Ref<boolean> {
    return this.isConnecting
  }

  connect() {
    if (this.eventSource || this.isConnecting.value) {
      return
    }

    const jwt = localStorage.getItem('jwt')
    if (!jwt) {
      console.warn('Cannot connect to SSE: No JWT token found')
      return
    }

    this.isConnecting.value = true

    const url = `${host}/api/events`
    const jwt = localStorage.getItem('jwt')
    if (!jwt) {
      console.warn('Cannot connect to SSE: No JWT token found')
      return
    }

    // Add authorization via URL parameter as EventSource doesn't support headers
    this.eventSource = new EventSource(`${url}?token=${encodeURIComponent(jwt)}`)

    this.eventSource.addEventListener('connected', (event) => {
      const data = JSON.parse(event.data)
      this.clientId = data.clientId
      this.isConnected.value = true
      this.isConnecting.value = false
      this.reconnectAttempts = 0
      console.log('SSE connected with client ID:', this.clientId)
    })

    this.eventSource.addEventListener('table-update', (event) => {
      const data = JSON.parse(event.data)
      this.notifyListeners('table-update', data)
    })

    this.eventSource.onerror = () => {
      console.error('SSE connection error')
      this.handleDisconnect()
    }
  }

  private handleDisconnect() {
    this.isConnected.value = false
    this.isConnecting.value = false
    this.clientId = null

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    // Attempt reconnection with exponential backoff
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      console.log(`SSE reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

      this.reconnectTimeout = setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.error('SSE max reconnection attempts reached')
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    this.isConnected.value = false
    this.isConnecting.value = false
    this.clientId = null
    this.reconnectAttempts = 0
  }

  subscribe(resource: string) {
    if (!this.clientId) {
      console.warn('Cannot subscribe: Not connected to SSE')
      return
    }

    const jwt = localStorage.getItem('jwt')
    if (!jwt) {
      console.warn('Cannot subscribe: No JWT token found')
      return
    }

    fetch(`${host}/api/events/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        clientId: this.clientId,
        resource,
      }),
    }).catch((error) => {
      console.error('Failed to subscribe to resource:', resource, error)
    })
  }

  unsubscribe(resource: string) {
    if (!this.clientId) {
      return
    }

    const jwt = localStorage.getItem('jwt')
    if (!jwt) {
      return
    }

    fetch(`${host}/api/events/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        clientId: this.clientId,
        resource,
      }),
    }).catch((error) => {
      console.error('Failed to unsubscribe from resource:', resource, error)
    })
  }

  on(eventType: SSEEventType, resource: string, callback: SSEEventCallback) {
    const key = `${eventType}:${resource}`
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)!.add(callback)

    // Auto-subscribe when listener is added
    if (this.isConnected.value) {
      this.subscribe(resource)
    }

    return () => this.off(eventType, resource, callback)
  }

  off(eventType: SSEEventType, resource: string, callback: SSEEventCallback) {
    const key = `${eventType}:${resource}`
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.delete(callback)
      if (listeners.size === 0) {
        this.listeners.delete(key)
        // Auto-unsubscribe when no listeners remain
        if (this.isConnected.value) {
          this.unsubscribe(resource)
        }
      }
    }
  }

  private notifyListeners(eventType: SSEEventType, data: { resource: string; [key: string]: unknown }) {
    const key = `${eventType}:${data.resource}`
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }
}

const sseService = new SSEService()

/**
 * Composable to use SSE for real-time table updates
 * @param resource - The resource type to listen for (e.g., 'veranstaltung', 'anmeldung')
 * @param onUpdate - Callback function to execute when the table is updated
 * @returns Object with connection state and manual control functions
 */
export function useSSE(resource: string, onUpdate: SSEEventCallback) {
  onMounted(() => {
    // Connect if not already connected
    if (!sseService.connected.value && !sseService.connecting.value) {
      sseService.connect()
    }

    // Wait for connection before subscribing (max 10 seconds)
    let attempts = 0
    const maxAttempts = 100 // 100 * 100ms = 10 seconds
    const checkConnection = setInterval(() => {
      attempts++
      if (sseService.connected.value) {
        clearInterval(checkConnection)
        sseService.subscribe(resource)
      } else if (attempts >= maxAttempts) {
        clearInterval(checkConnection)
        console.warn(`Failed to connect to SSE after ${maxAttempts * 100}ms`)
      }
    }, 100)

    // Set up listener
    const unsubscribe = sseService.on('table-update', resource, onUpdate)

    // Clean up on unmount
    onUnmounted(() => {
      clearInterval(checkConnection)
      unsubscribe()
    })
  })

  return {
    connected: sseService.connected,
    connecting: sseService.connecting,
    connect: () => sseService.connect(),
    disconnect: () => sseService.disconnect(),
  }
}

export { sseService }
