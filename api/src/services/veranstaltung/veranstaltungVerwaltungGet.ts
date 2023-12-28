import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const veranstaltungVerwaltungGetProcedure = defineProcedure({
  key: 'verwaltungGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number(),
  }),
  async handler(options) {
    const veranstaltungWithunterveranstaltungen = await prisma.veranstaltung.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        name: true,
        beginn: true,
        ende: true,
        ort: {
          select: {
            name: true,
            id: true,
          },
        },
        unterveranstaltungen: {
          select: {
            Anmeldung: {
              select: {
                person: {
                  select: {
                    firstname: true,
                    lastname: true,
                    birthday: true,
                  },
                },
              },
            },
          },
        },
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        beschreibung: true,
        datenschutz: true,
        teilnahmeBedingungen: true,
        zielgruppe: true,
      },
    })
    const { unterveranstaltungen, ...veranstaltung } = veranstaltungWithunterveranstaltungen
    const anmeldungen = unterveranstaltungen.flatMap((u) => u.Anmeldung)
    return {
      ...veranstaltung,
      anmeldungen,
    }
  },
})
