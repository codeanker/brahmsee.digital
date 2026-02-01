import type { HttpBindings } from '@hono/node-server'
import { Hono, type Context } from 'hono'

type Bindings = HttpBindings & {
  /* ... */
}

export type AppContext = Context<{ Bindings: Bindings }>

export function makeApp() {
  return new Hono<{ Bindings: Bindings }>()
}
