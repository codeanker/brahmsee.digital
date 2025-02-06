import { BlobSASPermissions } from '@azure/storage-blob'
import dayjs from 'dayjs'
import z from 'zod'

import { azureStorage } from '../../azureStorage.js'
import config from '../../config.js'
import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

const downloadUrlLifespan = 60 * 60 // 1 hour

export const fileGetUrlActionProcedure = definePublicQueryProcedure({
  key: 'fileGetUrl',
  inputSchema: z.strictObject({
    id: z.string().uuid().nullable(),
    personId: z.number().int().optional(),
  }),
  async handler({ input }) {
    if (typeof input.id !== 'string') {
      return null
    }

    type FileWhereUniqueInput = Parameters<typeof prisma.file.findUnique>[0]['where']
    const where: FileWhereUniqueInput = { id: input.id }

    console.log('personId', input.personId)

    if (input.personId) {
      where.Persons = {
        some: {
          id: input.personId,
        },
      }
    }

    const file = await prisma.file.findUnique({
      where,
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
