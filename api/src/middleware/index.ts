import type Router from 'koa-router'

import { downloadFileLocal } from './downloadFileLocal'
import { importAnmeldungen } from './importAnmeldungen'
import { uploadFileLocal } from './uploadFileLocal'

export default function addMiddlewares(router: Router) {
  router.post('/upload/anmeldungen', async (ctx, next) => {
    return await importAnmeldungen(ctx, next)
  })
  router.post('/upload/file/LOCAL/:id', uploadFileLocal)
  router.get('/download/file/LOCAL/:id', downloadFileLocal)
}
