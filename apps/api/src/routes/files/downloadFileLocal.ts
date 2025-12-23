import mime from 'mime'
import { createReadStream } from 'node:fs'
import prisma from '../../prisma.js'
import { uploadDir } from '../../services/file/helpers/getFileUrl.js'

export async function downloadFileLocal(fileId: string) {
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      provider: 'LOCAL',
    },
  })
  if (file === null) {
    return null
  }

  if (file.provider !== 'LOCAL') {
    return null
  }

  const mimetype = file.mimetype ?? 'application/octet-stream'
  const filename = file.filename ?? `${file.id}.${mime.getExtension(mimetype)}`

  return {
    mimetype,
    filename,
    stream: createReadStream(uploadDir + '/' + file.key),
  }
}
