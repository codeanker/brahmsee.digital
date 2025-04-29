import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

import { getPersonCreateData, personSchemaOptional } from './schema/person.schema.js'
import { TRPCError } from '@trpc/server'
import { updateMeiliPerson } from '../../meilisearch/person.js'

export const personVerwaltungPatchProcedure = defineProtectedMutateProcedure({
  key: 'patch',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: personSchemaOptional,
  }),
  async handler({ ctx, input }) {
    if (ctx.account.role === 'GLIEDERUNG_ADMIN') {
      const { gliederungId: gliederungIdActor } = await prisma.person.findFirstOrThrow({
        where: {
          account: {
            id: ctx.accountId,
          },
        },
        select: {
          gliederungId: true,
        },
      })
      const { gliederungId: gliederungIdTarget } = await prisma.person.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        select: {
          gliederungId: true,
        },
      })

      if (gliederungIdTarget !== gliederungIdActor) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        })
      }
    }

    await prisma.notfallkontakt.deleteMany({
      where: {
        personId: input.id,
      },
    })
    const person = await prisma.person.update({
      where: {
        id: input.id,
      },
      data: await getPersonCreateData(input.data),
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
