import z from 'zod'

import { updateMeiliPerson } from '../../meilisearch/person'
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
