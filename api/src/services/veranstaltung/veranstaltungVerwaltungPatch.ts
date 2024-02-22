import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const veranstaltungVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number(),
    data: z.strictObject({
      name: z.string().optional(),
      beginn: z.date().optional(),
      ende: z.date().optional(),
      ortId: z.number().int().optional(),
      meldebeginn: z.date().optional(),
      meldeschluss: z.date().optional(),
      maxTeilnehmende: z.number().int().optional(),
      teilnahmegebuehr: z.number().int().optional(),
      beschreibung: z.string().optional(),
      datenschutz: z.string().optional(),
      teilnahmeBedingungen: z.string().optional(),
      zielgruppe: z.string().optional(),
      hostnameId: z.number().int().optional(),
    }),
  }),
  async handler(options) {
    return prisma.veranstaltung.update({
      where: {
        id: options.input.id,
      },
      data: {
        name: options.input.data.name,
        beginn: options.input.data.beginn,
        ende: options.input.data.ende,
        meldebeginn: options.input.data.meldebeginn,
        meldeschluss: options.input.data.meldeschluss,
        maxTeilnehmende: options.input.data.maxTeilnehmende,
        teilnahmegebuehr: options.input.data.teilnahmegebuehr,
        beschreibung: options.input.data.beschreibung,
        datenschutz: options.input.data.datenschutz,
        teilnahmeBedingungen: options.input.data.teilnahmeBedingungen,
        zielgruppe: options.input.data.zielgruppe,
        ortId: options.input.data.ortId,
        hostnameId: options.input.data.hostnameId,
      },
      select: {
        id: true,
      },
    })
  },
})
