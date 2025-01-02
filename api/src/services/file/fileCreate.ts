import { randomUUID } from 'crypto'

import { BlobSASPermissions } from '@azure/storage-blob'
import dayjs from 'dayjs'
import z from 'zod'

import { azureStorage } from '../../azureStorage.js'
import config from '../../config.js'
import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const fileCreateProcedure = defineProtectedProcedure({
  key: 'fileCreate',
  method: 'mutation',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    mimetype: z.string(),
  }),
  async handler(options) {
    const provider = config.fileDefaultProvider
    let key: string = randomUUID()
    if (provider === 'AZURE') {
      key = `${config.fileProviders.AZURE.folder}/${key}`
    }

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
      const containerClient = azureStorage.getContainerClient(config.fileProviders.AZURE.container)
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
