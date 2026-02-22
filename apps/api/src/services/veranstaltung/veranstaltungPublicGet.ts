import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const veranstaltungPublicGetProcedure = definePublicQueryProcedure({
  key: 'publicGet',
  inputSchema: z.string(),
  handler: ({ input }) =>
    prisma.veranstaltung.findUniqueOrThrow({
      where: {
        publicReadToken: input,
      },
      select: {
        id: true,
        name: true,
        beginn: true,
        ende: true,
        ort: true,
        programmPunkte: {
          select: {
            id: true,
            name: true,
            description: true,
            location: true,
            responsible: true,
            startingAt: true,
            endingAt: true,
          },
          orderBy: {
            startingAt: 'asc',
          },
        },
      },
    }),
})
