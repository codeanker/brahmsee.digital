import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import type { AppRouter } from '@codeanker/api'

const host = import.meta.env[`VITE_APP_API_HOST`] || 'http://127.0.0.1:3030'

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString()
}

export const apiClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: (host !== '/' ? host : '') + '/api/trpc',
      async headers() {
        const jwt = localStorage.getItem('jwt')
        return {
          authorization: jwt !== null ? `Bearer ${jwt}` : undefined,
        }
      },
    }),
  ],
})
