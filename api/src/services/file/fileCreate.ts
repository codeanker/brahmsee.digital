import { randomUUID } from 'crypto'

import { BlobSASPermissions } from '@azure/storage-blob'
import dayjs from 'dayjs'
import z from 'zod'

import { azureStorage } from '../../azureStorage'
import config from '../../config'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const fileCreateProcedure = defineProcedure({
  key: 'fileCreate',
  method: 'mutation',
  protection: { type: 'public' }, // TODO: authentication
  inputSchema: z.strictObject({
    mimetype: z.string(),
  }),
  async handler(options) {
    const provider = config.defaultFileProvider
    const key: string = randomUUID()

    const file = await prisma.file.create({
      data: {
        provider: provider,
        key: key,
        mimetype: options.input.mimetype,
      },
      select: {
        id: true,
        provider: true,
        uploaded: true,
      },
    })

    let azureUploadUrl: string | null = null
    if (file.provider === 'AZURE' && azureStorage !== null) {
      const containerClient = azureStorage.getContainerClient(config.fileAZURE.container)
      const blockBlobClient = containerClient.getBlockBlobClient(key)
      const permissions = BlobSASPermissions.from({ read: true, write: true, add: true, create: true })
      azureUploadUrl = await blockBlobClient.generateSasUrl({
        startsOn: dayjs().subtract(5, 'minute').toDate(),
        expiresOn: dayjs().add(20, 'minute').toDate(),
        permissions: permissions,
        contentType: options.input.mimetype,
      })
    }

    return {
      ...file,
      azureUploadUrl,
    }
  },
})
