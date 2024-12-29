import { BlobSASPermissions } from '@azure/storage-blob'
import dayjs from 'dayjs'
import z from 'zod'

import { azureStorage } from '../../azureStorage'
import config from '../../config'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

const downloadUrlLifespan = 60 * 60 // 1 hour

export const fileGetUrlActionProcedure = defineProcedure({
  key: 'fileGetUrl',
  method: 'query',
  protection: { type: 'public' },
  inputSchema: z.strictObject({
    id: z.string().uuid().nullable(),
  }),
  async handler({ input }) {
    if (typeof input.id !== 'string') {
      return null
    }

    const file = await prisma.file.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
        provider: true,
        uploaded: true,
        key: true,
      },
    })

    if (file === null) {
      return null
    }

    if (file.provider === 'LOCAL') {
      if (!file.uploaded) throw new Error('File is not uploaded')
      return new URL(`/api/download/file/${file.provider}/${file.id}`, config.clientUrl).href
    }
    if (file.provider === 'AZURE' && azureStorage !== null) {
      const containerClient = azureStorage.getContainerClient(config.fileProviders.AZURE.container)
      const blockBlobClient = containerClient.getBlockBlobClient(file.key)
      return await blockBlobClient.generateSasUrl({
        startsOn: dayjs().subtract(5, 'minute').toDate(),
        expiresOn: dayjs().add(downloadUrlLifespan, 'seconds').toDate(),
        permissions: BlobSASPermissions.from({ read: true }),
      })
    }

    return null
  },
})
