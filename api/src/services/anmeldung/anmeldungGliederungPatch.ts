import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungGliederungPatchProcedure = defineProcedure({
  key: 'gliederungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.GLIEDERUNG_ADMIN, Role.ADMIN] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
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
