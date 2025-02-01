import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { TRPCError } from '@trpc/server'

export const anmeldungZuordnenProcedure = defineProtectedMutateProcedure({
  key: 'zuordnen',
  roleIds: [Role.USER],
  inputSchema: z.string().uuid(),
  handler: async ({ ctx, input }) => {
    const anmeldung = await prisma.anmeldung.findFirst({
      where: {
        assignmentCode: input,
      },
      select: {
        id: true,
      },
    })
    if (anmeldung === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }

    await prisma.anmeldung.update({
      where: {
        id: anmeldung.id,
      },
      data: {
        accountId: ctx.accountId,
        assignmentCode: null,
      },
    })
  },
})
