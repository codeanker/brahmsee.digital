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
  protection: { type: 'public' }, // TODO: authentication
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        provider: true,
        uploaded: true,
        key: true,
      },
    })
    if (!file.uploaded) throw new Error('File is not uploaded')

    if (file.provider === 'LOCAL')
      return new URL(`/api/download/file/${file.provider}/${file.id}`, config.clientUrl).href
    if (file.provider === 'AZURE' && azureStorage !== null) {
      const containerClient = azureStorage.getContainerClient(config.fileAZURE.container)
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
