import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { personSchema, getPersonCreateData } from './schema/person.schema'

export const personVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: personSchema,
  }),
  async handler(options) {
    return prisma.person.create({
      data: await getPersonCreateData(options.input.data),
      select: {
        id: true,
      },
    })
  },
})
