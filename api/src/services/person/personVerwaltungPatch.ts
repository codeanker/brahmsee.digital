import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProcedure } from '../../types/defineProcedure.js'

import { getPersonCreateData, personSchema } from './schema/person.schema.js'

export const personVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: personSchema,
  }),
  async handler({ input }) {
    await prisma.notfallkontakt.deleteMany({
      where: {
        personId: input.id,
      },
    })

    return prisma.person.update({
      where: {
        id: input.id,
      },
      data: await getPersonCreateData(input.data),
      select: {
        id: true,
      },
    })
  },
})
