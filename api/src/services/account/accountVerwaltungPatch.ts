import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const accountVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      email: z.string().email(),
      role: z.nativeEnum(Role),
    }),
  }),
  async handler(options) {
    return prisma.account.update({
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
