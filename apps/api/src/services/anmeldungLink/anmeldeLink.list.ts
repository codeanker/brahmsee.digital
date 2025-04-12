import { z } from 'zod'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import client from '../../prisma.js'

export const anmeldungLinkListProcedure = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
  }),
  handler: async ({ input: { unterveranstaltungId } }) => {
    const result = await client.anmeldungLink.findMany({
      where: {
        unterveranstaltungId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        usedAt: true,
        comment: true,
        createdBy: {
          select: {
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        anmeldung: {
          select: {
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    })

    return result
  },
})

export const anmeldungLinkCountProcedure = definePublicQueryProcedure({
  key: 'count',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
  }),
  handler: ({ input: { unterveranstaltungId } }) =>
    client.anmeldungLink.count({
      where: {
        unterveranstaltungId,
      },
    }),
})
