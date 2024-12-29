import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import type { appRouter } from './index'

export * from '@prisma/client'

export * from './enumMappings/index'
export type AppRouter = typeof appRouter
export type { TKontaktSchema } from './services/kontakt/schema/kontakt.schema'
export type { TAccountSchema } from './services/account/schema/account.schema'
export type { TPersonSchema } from './services/person/schema/person.schema'
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
