import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { emitTableUpdate } from '../../sse/index.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const veranstaltungVerwaltungCreateProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungCreate',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    data: z.strictObject({
      name: z.string(),
      beginn: z.date(),
      ende: z.date(),
      ortId: z.string().uuid(),
      meldebeginn: z.date(),
      meldeschluss: z.date(),
      maxTeilnehmende: z.number().int(),
      teilnahmegebuehr: z.number().int(),
      beschreibung: z.string().optional(),
      datenschutz: z.string().optional(),
      teilnahmeBedingungen: z.string().optional(),
      teilnahmeBedingungenPublic: z.string().optional(),
      zielgruppe: z.string().optional(),
      hostnameId: z.string().uuid().optional(),
    }),
  }),
  async handler(options) {
    const result = await prisma.veranstaltung.create({
      data: options.input.data,
      select: {
        id: true,
      },
    })
    emitTableUpdate('veranstaltung')
    return result
  },
})
