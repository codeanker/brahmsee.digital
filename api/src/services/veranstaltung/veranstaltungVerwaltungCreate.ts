import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const veranstaltungVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
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
      zielgruppe: z.string().optional(),
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
