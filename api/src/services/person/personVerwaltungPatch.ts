import { Gender } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const personVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      firstname: z.string(),
      lastname: z.string(),
      birthday: z.string(),
      gliederungId: z.number().int().nullable(),
      gender: z.nativeEnum(Gender).nullable(),
    }),
  }),
  async handler(options) {
    return prisma.person.update({
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
