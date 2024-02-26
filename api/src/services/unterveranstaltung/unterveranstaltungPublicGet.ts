import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const unterveranstaltungPublicGetProcedure = defineProcedure({
  key: 'publicGet',
  method: 'query',
  protection: { type: 'public' },
  inputSchema: z.strictObject({
    id: z.number(),
  }),
  async handler(options) {
    const unterveranstaltung = await prisma.unterveranstaltung.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        veranstaltungId: true,
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        type: true,
        veranstaltung: {
          select: {
            name: true,
            beginn: true,
            ende: true,
            ort: {
              select: {
                name: true,
              },
            },
            datenschutz: true,
            teilnahmeBedingungen: true,
            teilnahmeBedingungenPublic: true,
            zielgruppe: true,
          },
        },
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
        beschreibung: true,
        bedingungen: true,
      },
    })
    return unterveranstaltung
  },
})
