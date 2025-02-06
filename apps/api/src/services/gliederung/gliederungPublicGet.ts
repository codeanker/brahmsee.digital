import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const gliederungPublicGetProcedure = definePublicQueryProcedure({
  key: 'publicGet',
  inputSchema: z.strictObject({
    gliederungId: z.number().int(),
  }),
  async handler(options) {
    return prisma.gliederung.findUniqueOrThrow({
      where: {
        id: options.input.gliederungId,
      },
      select: {
        name: true,
      },
    })
  },
})
