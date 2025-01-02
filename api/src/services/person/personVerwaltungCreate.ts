import { Role } from '@prisma/client'
import z from 'zod'

import { updateMeiliPerson } from '../../meilisearch/person.js'
import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

import { personSchema, getPersonCreateData } from './schema/person.schema.js'

export const personVerwaltungCreateProcedure = defineProtectedProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    data: personSchema,
  }),
  async handler(options) {
    const person = await prisma.person.create({
      data: await getPersonCreateData(options.input.data),
      select: {
        id: true,
        firstname: true,
        lastname: true,
        birthday: true,
        email: true,
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    await updateMeiliPerson({
      id: person.id,
      firstname: person.firstname,
      lastname: person.lastname,
      birthday: person.birthday,
      email: person.email,
      gliederung: person.gliederung,
    })

    return person
  },
})
