import * as fs from 'fs'
import * as path from 'path'

import type { Middleware } from 'koa'
import mime from 'mime-types'

import config from '../config'
import prisma from '../prisma'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const downloadFileLocal: Middleware = async function (ctx, next) {
  // TODO: add authentication
  const fileId = parseInt(ctx.params.id)
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
    },
  })
  if (file === null) {
    ctx.response.status = 400
    ctx.response.body = { error: `File with id '${fileId}' not found` }
    return
  }

  if (file.provider !== 'LOCAL') {
    ctx.response.status = 400
    ctx.response.body = { error: `File provider is '${file.provider}'. This endpoint is for LOCAL` }
    return
  }

  const uploadDir = path.join(process.cwd(), config.fileLOCAL.path)
  const mimetype = file.mimetype ?? 'application/octet-stream'
  const filename = file.filename ?? `${file.id}.${mime.extension(mimetype)}`
  ctx.set('Content-disposition', `attachment; filename=${filename}`)
  ctx.set('Content-type', mimetype)
  ctx.response.body = fs.createReadStream(uploadDir + '/' + file.key)
}
