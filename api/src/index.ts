import { serviceRouter } from "./services/index.js"
import { mergeRouters } from "./trpc.js"

export const appRouter = mergeRouters(serviceRouter)
