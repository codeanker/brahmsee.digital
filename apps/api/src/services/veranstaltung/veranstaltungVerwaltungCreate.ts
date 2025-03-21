import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const veranstaltungVerwaltungCreateProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungCreate',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    data: z.strictObject({
      name: z.string(),
      beginn: z.date(),
      ende: z.date(),
      ortId: z.number().int(),
      meldebeginn: z.date(),
      meldeschluss: z.date(),
      maxTeilnehmende: z.number().int(),
      teilnahmegebuehr: z.number().int(),
      beschreibung: z.string().optional(),
      datenschutz: z.string().optional(),
      teilnahmeBedingungen: z.string().optional(),
      teilnahmeBedingungenPublic: z.string().optional(),
      zielgruppe: z.string().optional(),
      hostnameId: z.number().int().optional(),
    }),
  }),
  async handler(options) {
    return prisma.veranstaltung.create({
      data: options.input.data,
      select: {
        id: true,
      },
    })
  },
})
