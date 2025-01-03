import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

import { getPersonCreateData, personSchema } from './schema/person.schema.js'

export const personGliederungPatchProcedure = defineProtectedProcedure({
  key: 'gliederungPatch',
  method: 'mutation',
  roleIds: [Role.GLIEDERUNG_ADMIN],
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
