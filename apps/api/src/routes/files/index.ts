import type { File as Entity } from '@prisma/client'
import { createMiddleware } from 'hono/factory'
import client from '../../prisma.js'
import { makeApp } from '../../util/make-app.js'
import { downloadFileLocal } from '../files/downloadFileLocal.js'
import { uploadFileLocal } from '../files/uploadFileLocal.js'

const fileRouter = makeApp()

fileRouter.get('/download/LOCAL/:id', async (ctx) => {
  const fileId = ctx.req.param('id')
  const result = await downloadFileLocal(fileId)
  if (result === null) {
    ctx.status(404)
  } else {
    ctx.header('Content-Disposition', `attachment; filename=${result.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`)
    ctx.header('Content-Type', result.mimetype)
  }
})

const entity = createMiddleware<{
  Bindings: { entity: Entity }
}>(async (ctx, next) => {
  const fileId = ctx.req.param('id')

  const file = await client.file.findFirst({
    where: {
      id: fileId,
    },
  })

  if (file === null || file.provider !== 'LOCAL') {
    return ctx.json({ error: 'file not found' }, 404)
  }
  if (file.uploaded) {
    return ctx.json({ error: 'file already present' }, 403)
  }

  return await next()
})

const multipart = createMiddleware<{
  Bindings: { file: File }
}>(async (ctx, next) => {
  const body = await ctx.req.parseBody()
  const file = body['file']
  if (!(file instanceof File)) {
    return ctx.json({ error: 'Upload is not a file' }, 400)
  }

  ctx.env.file = file
  return await next()
})

fileRouter.post('/upload/LOCAL/:id', entity, multipart, async (ctx) => {
  await uploadFileLocal(ctx.env.entity, ctx.env.file)
  ctx.status(201)
})

export { fileRouter }
