import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import type { AppRouter } from '@codeanker/api'

const host = import.meta.env[`VITE_APP_API_HOST`] || '/'

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString()
}

export const apiClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
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
