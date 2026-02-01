import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { TRPCError } from '@trpc/server'

export const anmeldungLinkCreateProcedure = defineProtectedMutateProcedure({
  key: 'create',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    unterveranstaltungId: z.string().uuid(),
    comment: z.string().optional(),
  }),
  handler: async ({ ctx, input: { unterveranstaltungId, comment } }) => {
    const { accessToken } = await prisma.anmeldungLink.create({
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

    if (accessToken === null) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'failed to generate access token',
      })
    }

    return accessToken
  },
})
