import type Router from 'koa-router'

import { importAnmeldungen } from './importAnmeldungen'

export default function addMiddlewares(router: Router) {
  router.post(
    '/upload/anmeldungen',
    async (ctx, next) => {
      if (!ctx.request.files) {
        ctx.response.status = 400
        return
      }

      for (const file of Object.keys(ctx.request.files)) {
        if (!file.endsWith('.csv')) {
          ctx.response.status = 406
          return
        }
      }

      return await next()
    },
    importAnmeldungen
  )
}
