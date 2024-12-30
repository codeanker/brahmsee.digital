import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createContext } from './context.js'

import { appRouter } from './index.js'

addEventListener('fetch', (event) => {
  return event.respondWith(
    fetchRequestHandler({
      endpoint: '/trpc',
      req: event.request,
      router: appRouter,
      createContext,
    })
  )
})

export const config = {
  runtime: 'nodejs',
}
