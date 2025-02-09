import { Role, UnterveranstaltungType } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { unterveranstaltungCreateSchema } from './schema/unterveranstaltung.schema.js'

const unterveranstaltungVerwaltungCreateSchema = unterveranstaltungCreateSchema.extend({
  gliederungId: z.number().int(),
  type: z.nativeEnum(UnterveranstaltungType),
})

export const unterveranstaltungVerwaltungCreateProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungCreate',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    data: unterveranstaltungVerwaltungCreateSchema,
  }),
  async handler({ input }) {
    const unterveranstaltung = await prisma.unterveranstaltung.create({
      data: {
        veranstaltung: {
          connect: {
            id: input.data.veranstaltungId,
          },
        },
        maxTeilnehmende: input.data.maxTeilnehmende,
        teilnahmegebuehr: input.data.teilnahmegebuehr,
        meldebeginn: input.data.meldebeginn,
        meldeschluss: input.data.meldeschluss,
        beschreibung: input.data.beschreibung,
        bedingungen: input.data.bedingungen,
        type: input.data.type,
        gliederung: {
          connect: {
            id: input.data.gliederungId,
          },
        },
      },
      select: {
        id: true,
      },
    })

    return unterveranstaltung
  },
})
