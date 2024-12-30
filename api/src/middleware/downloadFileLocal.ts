import * as fs from 'fs'
import * as path from 'path'

import type { Middleware } from 'koa'
import mime from 'mime-types'

import config from '../config.js'
import prisma from '../prisma.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const downloadFileLocal: Middleware = async function (ctx, next) {
  const fileId = ctx.params.id
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
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

  const uploadDir = path.join(process.cwd(), config.fileProviders.LOCAL.path)
  const mimetype = file.mimetype ?? 'application/octet-stream'
  const filename = file.filename ?? `${file.id}.${mime.extension(mimetype)}`
  ctx.set('Content-disposition', `attachment; filename=${filename}`)
  ctx.set('Content-type', mimetype)
  ctx.response.body = fs.createReadStream(uploadDir + '/' + file.key)
}
