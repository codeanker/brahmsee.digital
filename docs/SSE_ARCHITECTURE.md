# Server-Sent Events (SSE) Architecture

## Overview

This application uses Server-Sent Events (SSE) to provide real-time notifications when table data changes. When a user creates, updates, or deletes data through the API, all connected clients receive notifications and automatically refresh their tables.

## Architecture

### Backend Components

#### 1. SSE Manager (`apps/api/src/sse/SSEManager.ts`)

The `SSEManager` class manages all SSE client connections and handles event broadcasting:

- **Client Management**: Maintains a map of connected clients with their IDs and subscriptions
- **Subscription System**: Clients can subscribe to specific resources (e.g., 'veranstaltung', 'anmeldung')
- **Broadcasting**: Sends events to all clients subscribed to a specific resource
- **Cleanup**: Automatically removes disconnected clients

#### 2. SSE Routes (`apps/api/src/sse/routes.ts`)

HTTP endpoints for SSE functionality:

- **`GET /api/events`**: Main SSE connection endpoint
  - Accepts JWT token via query parameter (EventSource limitation)
  - Returns event stream with `text/event-stream` content type
  - Sends heartbeat every 30 seconds to keep connection alive
  - Handles client disconnect and cleanup

- **`POST /api/events/subscribe`**: Subscribe to specific resource updates
- **`POST /api/events/unsubscribe`**: Unsubscribe from resource updates

#### 3. Helper Functions (`apps/api/src/sse/helpers.ts`)

Utility functions for emitting events:

- **`emitTableUpdate(resource, data?)`**: Broadcast update event for a resource
- **`withSSENotification(resource, mutationFn)`**: Wrapper for mutations that automatically emits events

### Frontend Components

#### 1. SSE Service (`apps/frontend/src/composables/useSSE.ts`)

The `SSEService` singleton manages the SSE connection:

- **Connection Management**: Establishes and maintains SSE connection
- **Authentication**: Passes JWT token via query parameter
- **Reconnection Logic**: Exponential backoff with max 5 attempts
- **Subscription Management**: Auto-subscribe/unsubscribe based on active listeners
- **Event Handling**: Routes events to registered callbacks

#### 2. useSSE Composable

Vue composable for easy SSE integration in components:

```typescript
useSSE('veranstaltung', () => {
  console.log('Veranstaltung updated, refreshing...')
  dataTableRef.value?.query.refetch()
})
```

Features:
- Automatic connection on mount
- Subscription to specific resource
- Cleanup on unmount
- Returns connection state and control functions

## Integration Points

### Backend Mutations

SSE events are emitted after successful database operations:

```typescript
// Example from veranstaltungVerwaltungCreate.ts
async handler(options) {
  const result = await prisma.veranstaltung.create({
    data: options.input.data,
    select: { id: true },
  })
  emitTableUpdate('veranstaltung')  // ← Emit SSE event
  return result
}
```

Currently integrated with:
- ✅ Veranstaltung create/update
- ✅ Anmeldung create/update

### Frontend Tables

Tables automatically refresh when receiving SSE events:

```typescript
// Example from VeranstaltungList.vue
const dataTableRef = ref<{ query: ReturnType<Query<Veranstaltung>> }>()

useSSE('veranstaltung', () => {
  console.log('Veranstaltung table updated, refreshing...')
  dataTableRef.value?.query.refetch()  // ← Trigger refetch
})
```

Currently integrated with:
- ✅ VeranstaltungList
- ✅ AnmeldungenTable

## Technical Details

### Authentication

EventSource API doesn't support custom headers, so authentication uses URL query parameters:

```typescript
const jwt = localStorage.getItem('jwt')
const url = `/api/events?token=${encodeURIComponent(jwt)}`
this.eventSource = new EventSource(url)
```

The backend extracts and validates the token from the query parameter.

### Event Format

SSE events follow this format:

```
event: table-update
data: {"resource":"veranstaltung"}

```

Event types:
- `connected`: Initial connection confirmation with clientId
- `table-update`: Notification that a table's data has changed
- `: heartbeat`: Keep-alive comment (every 30s)

### Reconnection Strategy

The client uses exponential backoff for reconnection:

1. Initial connection attempt
2. On disconnect: wait 2^attempt seconds (max 30s)
3. Max 5 reconnection attempts
4. Manual reconnection possible via `sseService.connect()`

### Resource Subscriptions

Clients can subscribe to specific resources or use `*` for all updates:

```typescript
sseManager.subscribe(clientId, 'veranstaltung')  // Only veranstaltung updates
sseManager.subscribe(clientId, '*')              // All updates
```

## Adding SSE to New Resources

### 1. Backend: Emit events in mutations

```typescript
import { emitTableUpdate } from '../../sse/index.js'

async handler(options) {
  const result = await prisma.myResource.create({ ... })
  emitTableUpdate('myResource')  // Add this line
  return result
}
```

### 2. Frontend: Add to table component

```typescript
import { useSSE } from '@/composables/useSSE'

const dataTableRef = ref<{ query: ReturnType<Query<MyResource>> }>()

useSSE('myResource', () => {
  console.log('MyResource table updated, refreshing...')
  dataTableRef.value?.query.refetch()
})
```

## Performance Considerations

- **Connection Overhead**: Each client maintains one persistent HTTP connection
- **Broadcast Efficiency**: Events only sent to subscribed clients
- **Network Usage**: Heartbeat every 30s (~10 bytes per client)
- **Memory**: Manager keeps client map in memory (cleaned up on disconnect)

## Limitations

- EventSource doesn't support custom headers (authentication via query param)
- One-way communication only (server → client)
- No guaranteed delivery (client might miss events during disconnect)
- Browser connection limits (typically 6 per domain)

## Troubleshooting

### Connection Issues

Check browser console for:
- `SSE connected with client ID: ...` → Success
- `SSE connection error` → Connection failed
- `SSE reconnecting in Xms` → Automatic retry

### Missing Updates

1. Verify mutation emits SSE event: `emitTableUpdate('resource')`
2. Check frontend subscription: `useSSE('resource', callback)`
3. Confirm resource name matches exactly
4. Check browser Network tab for `/api/events` connection

### Authentication Errors

- Ensure JWT token exists in localStorage
- Check token hasn't expired
- Verify token is valid on backend
