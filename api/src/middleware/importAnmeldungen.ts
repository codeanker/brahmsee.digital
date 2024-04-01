import type { Middleware } from 'koa'

import { logger } from '../logger'

export const importAnmeldungen: Middleware = async function (ctx) {
  for (const file of Object.keys(ctx.request.files!)) {
    // TODO: Process file
    logger.info(`processing file ${file}`)
  }

  ctx.response.status = 200
  ctx.response.body = {
    ok: true,
  }
}
