import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const gliederungVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
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
