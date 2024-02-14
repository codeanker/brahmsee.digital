import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createContext } from './context'

import { appRouter } from './index'

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
