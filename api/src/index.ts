import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { serviceRouter } from './services'
import { mergeRouters } from './trpc'

export const appRouter = mergeRouters(serviceRouter)

export type AppRouter = typeof appRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export * as testUtils from './util/test'
export * from './enumMappings/index'
