import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import type { AuthenticatedContext } from '../../trpc.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

const select = {
  id: true,
  status: true,
  mahlzeiten: true,
  uebernachtungsTage: true,
  createdAt: true,
  comment: true,
  customFieldValues: {
    select: {
      id: true,
      value: true,
      field: true,
    },
  },
  person: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      birthday: true,
      gender: true,
      email: true,
      telefon: true,
      gliederung: {
        select: {
          id: true,
          name: true,
          edv: true,
        },
      },
      essgewohnheit: true,
      nahrungsmittelIntoleranzen: true,
      weitereIntoleranzen: true,
      notfallkontakte: true,
      address: true,
      photoId: true,
    },
  },
  unterveranstaltung: {
    select: {
      id: true,
      beschreibung: true,
      gliederung: {
        select: {
          id: true,
          name: true,
          edv: true,
        },
      },
      veranstaltung: {
        select: {
          id: true,
          name: true,
          meldeschluss: true,
        },
      },
    },
  },
} satisfies Prisma.AnmeldungSelect

const inputSchema = z.strictObject({
  anmeldungId: z.number().optional(),
  personId: z.number().optional(),
})

type InputSchema = z.infer<typeof inputSchema>

function getWhere({ ctx, input }: { ctx: AuthenticatedContext; input: InputSchema }): Prisma.AnmeldungWhereInput {
  const where: Prisma.AnmeldungWhereInput = {
    OR: [
      {
        personId: input.personId,
      },
      {
        id: input.anmeldungId,
      },
    ],
  }

  if (ctx.account?.role === 'USER') {
    where.accountId = ctx.accountId
  }

  return where
}

export const anmeldungGetProcedure = defineProtectedQueryProcedure({
  key: 'get',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema,
  handler: ({ ctx, input }) =>
    prisma.anmeldung.findMany({
      where: getWhere({ ctx, input }),
      select,
    }),
})
