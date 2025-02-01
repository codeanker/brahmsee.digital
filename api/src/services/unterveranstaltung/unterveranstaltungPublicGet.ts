import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const unterveranstaltungPublicGetProcedure = definePublicQueryProcedure({
  key: 'publicGet',
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
            hostname: true,
          },
        },
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            Anmeldung: {
              where: {
                status: 'BESTAETIGT',
              },
            },
          },
        },
        beschreibung: true,
        bedingungen: true,
        documents: {
          select: {
            name: true,
            fileId: true,
          },
        },
      },
    })

    return unterveranstaltung
  },
})
