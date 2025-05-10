import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { deleteMeiliPerson } from '../../meilisearch/person.js'

export const personVerwaltungRemoveProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungRemove',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    await prisma.person.delete({
      where: {
        id: options.input.id,
      },
    })

    await deleteMeiliPerson(options.input.id)
    return options.input.id
  },
})
