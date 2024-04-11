import type Router from 'koa-router'

import { importAnmeldungen } from './importAnmeldungen'

export default function addMiddlewares(router: Router) {
  router.post('/upload/anmeldungen', async (ctx, next) => {
    return await importAnmeldungen(ctx, next)
  })
}
