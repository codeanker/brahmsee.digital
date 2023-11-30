import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const unterveranstaltungVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      unterveranstaltungId: z.number().int(),
      maxTeilnehmende: z.number().int().optional(),
      teilnahmegebuehr: z.number({ description: 'In Cent' }).int().optional(),
      meldebeginn: z.date().optional(),
      meldeschluss: z.date().optional(),
      beschreibung: z.string().optional(),
    }),
  }),
  async handler(options) {
    return prisma.unterveranstaltung.update({
      where: {
        id: options.input.data.unterveranstaltungId,
      },
      data: options.input.data,
      select: {
        id: true,
      },
    })
  },
})
