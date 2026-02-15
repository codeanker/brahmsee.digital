import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { zEmptyStringAsUndefined } from '../../util/zod.js'

export const gliederungVerwaltungPatchProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungPatch',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.string().uuid(),
    data: z.strictObject({
      name: z.string(),
      edv: z.string(),
      email: z.string().email().optional().transform(zEmptyStringAsUndefined),
    }),
  }),
  async handler({ input }) {
    return prisma.gliederung.update({
      data: {
        name: input.data.name,
        edv: input.data.edv,
        email: input.data.email,
      },
      where: {
        id: input.id,
      },
      select: {
        name: true,
        edv: true,
        email: true,
      },
    })
  },
})
