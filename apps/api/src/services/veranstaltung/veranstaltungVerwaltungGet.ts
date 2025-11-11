import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { unterveranstaltungSelect, veranstaltungSelect } from './veranstaltung.list.js'

export const veranstaltungVerwaltungGetProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungGet',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.number(),
  }),
  async handler({ input }) {
    const v = await prisma.veranstaltung.findUniqueOrThrow({
      where: {
        id: input.id,
      },
      select: {
        ...veranstaltungSelect,
        publicReadToken: true,
        unterveranstaltungen: {
          select: {
            ...unterveranstaltungSelect,
          },
        },
      },
    })

    const mapped = {
      ...v,
      anzahlAnmeldungen: v.unterveranstaltungen.reduce((a, b) => a + b._count.Anmeldung, 0),
    }

    return mapped
  },
})
