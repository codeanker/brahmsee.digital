import { Role, UnterveranstaltungType } from '@prisma/client'
import z from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"

export const unterveranstaltungVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      veranstaltungId: z.number().int(),
      maxTeilnehmende: z.number().int(),
      teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
      meldebeginn: z.date(),
      meldeschluss: z.date(),
      gliederungId: z.number().int(),
      type: z.nativeEnum(UnterveranstaltungType),
      beschreibung: z.string().optional(),
      bedingungen: z.string().optional(),
    }),
  }),
  async handler(options) {
    return prisma.unterveranstaltung.create({
      data: options.input.data,
      select: {
        id: true,
      },
    })
  },
})
