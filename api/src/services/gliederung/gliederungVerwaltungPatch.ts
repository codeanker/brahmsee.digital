import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const gliederungVerwaltungPatchProcedure = defineProtectedProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      name: z.string(),
      edv: z.string(),
    }),
  }),
  async handler({ input }) {
    return prisma.gliederung.update({
      data: {
        name: input.data.name,
        edv: input.data.edv,
      },
      where: {
        id: input.id,
      },
      select: {
        name: true,
        edv: true,
      },
    })
  },
})
