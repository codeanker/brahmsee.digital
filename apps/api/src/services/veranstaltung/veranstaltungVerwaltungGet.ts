import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const veranstaltungVerwaltungGetProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungGet',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
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
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        beschreibung: true,
        datenschutz: true,
        teilnahmeBedingungen: true,
        teilnahmeBedingungenPublic: true,
        zielgruppe: true,
        hostname: {
          select: {
            id: true,
            hostname: true,
          },
        },
        publicReadToken: true,
        unterveranstaltungen: {
          select: {
            id: true,
            _count: {
              select: {
                Anmeldung: {
                  where: {
                    status: {
                      equals: 'BESTAETIGT',
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    return veranstaltungWithunterveranstaltungen
  },
})
