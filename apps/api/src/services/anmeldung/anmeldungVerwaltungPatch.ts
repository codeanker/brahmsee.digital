import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const anmeldungVerwaltungPatchProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungPatch',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.string().uuid(),
    data: z.strictObject({
      tshirtBestellt: z.boolean().optional(),
      comment: z.string().optional(),
    }),
  }),
  async handler(options) {
    return prisma.anmeldung.update({
      where: {
        id: options.input.id,
      },
      data: options.input.data,
      select: {
        id: true,
      },
    })
  },
})
