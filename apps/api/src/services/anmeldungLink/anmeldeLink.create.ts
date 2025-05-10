import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import client from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const anmeldungLinkCreateProcedure = defineProtectedMutateProcedure({
  key: 'create',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
    comment: z.string().optional(),
  }),
  handler: async ({ ctx, input: { unterveranstaltungId, comment } }) => {
    const result = await client.anmeldungLink.create({
      data: {
        unterveranstaltungId,
        comment,
        accessToken: randomUUID(),
        createdById: ctx.accountId,
      },
      select: {
        accessToken: true,
      },
    })

    return result.accessToken
  },
})
