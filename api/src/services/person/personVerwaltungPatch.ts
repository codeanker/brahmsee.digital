import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { getPersonCreateData, personSchema } from './schema/person.schema'

export const personVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: personSchema,
  }),
  async handler(options) {
    return prisma.person.update({
      where: {
        id: options.input.id,
      },
      data: await getPersonCreateData(options.input.data),
      select: {
        id: true,
      },
    })
  },
})
