import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const veranstaltungPublicGetProcedure = definePublicQueryProcedure({
  key: 'publicGet',
  inputSchema: z.number(),
  handler: ({ input }) =>
    prisma.veranstaltung.findUniqueOrThrow({
      where: {
        id: input,
      },
      select: {
        name: true,
      },
    }),
})
