import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

import type { AppRouter } from '@codeanker/api'

export const apiClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
})
