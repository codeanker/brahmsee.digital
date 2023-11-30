import { UnterveranstaltungType } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const unterveranstaltungVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      veranstaltungId: z.number().int(),
      maxTeilnehmende: z.number().int(),
      teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
      meldebeginn: z.date(),
      meldeschluss: z.date(),
      gliederungId: z.number().int(),
      type: z.nativeEnum(UnterveranstaltungType),
      beschreibung: z.string(),
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
