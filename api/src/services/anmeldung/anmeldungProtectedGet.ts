import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

const inputSchema = z.strictObject({
  anmeldungId: z.number().optional(),
  personId: z.number().optional(),
})

export type AnmeldungProtectedGetSchema = z.infer<typeof inputSchema>

export const anmeldungProtectedGetProcedure = defineProtectedProcedure({
  key: 'gliederungGet',
  method: 'query',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema,
  handler: ({ input }) =>
    prisma.anmeldung.findMany({
      where: {
        OR: [
          {
            personId: input.personId,
          },
          {
            id: input.anmeldungId,
          },
        ],
      },
      include: {
        customFieldValues: true,
        person: {
          include: {
            gliederung: true,
          },
        },
        unterveranstaltung: {
          include: {
            veranstaltung: true,
          },
        },
      },
    }),
})
