import * as fs from 'fs'

import type { Middleware } from 'koa'
import mime from 'mime'

import prisma from '../../prisma.js'
import { uploadDir } from '../../services/file/helpers/getFileUrl.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const downloadFileLocal: Middleware = async function (ctx, next) {
  const params = ctx.params as { id: string }
  const fileId = params.id
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      provider: 'LOCAL',
    },
  })
  if (file === null) {
    ctx.response.status = 404
    return
  }

  if (file.provider !== 'LOCAL') {
    ctx.response.status = 404
    return
  }

  const mimetype = file.mimetype ?? 'application/octet-stream'
  const filename = file.filename ?? `${file.id}.${mime.getExtension(mimetype)}`
  ctx.set('Content-disposition', `attachment; filename=${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`)
  ctx.set('Content-type', mimetype)
  ctx.response.body = fs.createReadStream(uploadDir + '/' + file.key)
}
