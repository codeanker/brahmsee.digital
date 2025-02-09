import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import { getFileUrl } from './helpers/getFileUrl.js'

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

    return await getFileUrl(file)
  },
})
