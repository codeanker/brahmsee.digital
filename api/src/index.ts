import { serviceRouter } from './services'
import { mergeRouters } from './trpc'

export const appRouter = mergeRouters(serviceRouter)
