import type { File as Entity } from '@prisma/client'
import { createWriteStream } from 'node:fs'
import { mkdir, stat } from 'node:fs/promises'
import { Readable } from 'node:stream'
import prisma from '../../prisma.js'
import { uploadDir } from '../../services/file/helpers/getFileUrl.js'

export async function uploadFileLocal(entity: Entity, multipart: File) {
  try {
    const stats = await stat(uploadDir)
    if (!stats.isDirectory()) {
      await mkdir(uploadDir, { recursive: true })
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    await mkdir(uploadDir, { recursive: true })
  }

  const ws = createWriteStream(`${uploadDir}/${entity.key}`)
  const rs = Readable.fromWeb(multipart.stream())

  rs.pipe(ws)

  await new Promise((resolve, reject) => {
    rs.once('close', resolve)
    rs.once('error', reject)
  })

  await prisma.file.update({
    where: { id: entity.id },
    data: {
      mimetype: multipart.type ?? 'application/octet-stream',
      filename: multipart.name,
      uploaded: true,
      uploadedAt: new Date(),
      provider: 'LOCAL',
    },
  })
}
