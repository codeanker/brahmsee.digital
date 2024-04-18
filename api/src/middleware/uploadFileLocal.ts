import * as fs from 'fs/promises'
import * as path from 'path'

import type { Middleware } from 'koa'

import config from '../config'
import prisma from '../prisma'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadFileLocal: Middleware = async function (ctx, next) {
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

  if (file.uploaded) {
    ctx.response.status = 400
    ctx.response.body = { error: `File with id '${fileId}' already uploaded` }
    return
  }

  if (file.provider !== 'LOCAL') {
    ctx.response.status = 400
    ctx.response.body = { error: `File provider is '${file.provider}'. This endpoint is for LOCAL` }
    return
  }

  const uploadDir = path.join(process.cwd(), config.fileProviders.LOCAL.path)
  try {
    await checkLocalUploadFolder(uploadDir)
  } catch (e) {
    console.error('Error while creating upload-directory\n', e)
    ctx.response.status = 500
    ctx.response.body = {
      error: 'Something went wrong during creation of upload-directory',
    }
    return
  }

  const fileData = ctx.request.files?.file
  if (!fileData || Array.isArray(fileData)) {
    ctx.response.status = 400
    ctx.response.body = {
      error: 'No or Invalid File provided',
    }
    return
  }

  try {
    await fs.copyFile(fileData.filepath, uploadDir + '/' + file.key)
  } catch (e) {
    console.error('Error while copy to upload-directory\n', e)
    ctx.response.status = 500
    ctx.response.body = {
      error: 'Something went wrong during copy to upload-directory',
    }
    return
  }

  await prisma.file.update({
    where: { id: fileId },
    data: {
      mimetype: fileData.mimetype ?? 'application/octet-stream',
      filename: fileData.originalFilename ?? undefined,
      uploaded: true,
      uploadedAt: new Date(),
    },
  })

  ctx.response.status = 201
  ctx.response.body = { uploaded: true }
}

async function checkLocalUploadFolder(uploadDir: string) {
  try {
    await fs.stat(uploadDir)
  } catch (e: any) {
    if (e.code === 'ENOENT') await fs.mkdir(uploadDir, { recursive: true })
    else throw e
  }
}
