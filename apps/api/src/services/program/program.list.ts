import { groupBy } from '@codeanker/helpers'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const programListProcedure = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    veranstaltungId: z.number().int(),
  }),
  handler: async ({ input }) => {
    const result = await prisma.programmPunkt.findMany({
      where: {
        veranstaltungId: input.veranstaltungId,
      },
      select: {
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
    })

    const grouped = groupBy(result, (row) => row.startingAt.getTime())
    return Object.entries(grouped).sort(([timestampA], [timestampB]) => timestampB.localeCompare(timestampA))
  },
})
