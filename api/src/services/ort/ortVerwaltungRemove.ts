import { Role } from '@prisma/client'
import z from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"

export const ortVerwaltungRemoveProcedure = defineProcedure({
  key: 'verwaltungRemove',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler({ input }) {
    return prisma.ort.delete({
      where: {
        id: input.id,
      },
      select: {
        id: true,
      },
    })
  },
})
