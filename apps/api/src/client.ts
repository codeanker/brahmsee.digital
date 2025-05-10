import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import type { appRouter } from './index.js'

export * from '@prisma/client'

export type AppRouter = typeof appRouter
export type { TKontaktSchema } from './services/kontakt/schema/kontakt.schema.js'
export type { TAccountSchema } from './services/account/schema/account.schema.js'
export type { TPersonSchema } from './services/person/schema/person.schema.js'
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export * from './types/enums/index.js'
export * from './types/enums/mappings/index.js'

export type { VeranstaltungSettings } from './services/veranstaltung/veranstaltung.schema.js'
