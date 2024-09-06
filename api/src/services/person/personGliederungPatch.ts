import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { getPersonCreateData, personSchema } from './schema/person.schema'

export const personGliederungPatchProcedure = defineProcedure({
  key: 'gliederungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.GLIEDERUNG_ADMIN] },
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
