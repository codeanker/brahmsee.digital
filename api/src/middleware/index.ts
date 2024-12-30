import type Router from 'koa-router'

import { downloadFileLocal } from './downloadFileLocal.js'
import { importAnmeldungen } from './importAnmeldungen.js'
import { uploadFileLocal } from './uploadFileLocal.js'

export default function addMiddlewares(router: Router) {
  router.post('/upload/anmeldungen', async (ctx, next) => {
    return await importAnmeldungen(ctx, next)
  })
  router.post('/upload/file/LOCAL/:id', uploadFileLocal)
  router.get('/download/file/LOCAL/:id', downloadFileLocal)
}
