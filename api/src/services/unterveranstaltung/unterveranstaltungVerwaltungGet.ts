import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const unterveranstaltungVerwaltungGetProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungGet',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return prisma.unterveranstaltung.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        beschreibung: true,
        bedingungen: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        meldebeginn: true,
        meldeschluss: true,
        type: true,
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
        veranstaltung: {
          select: {
            id: true,
            name: true,
            beginn: true,
            ende: true,
            ort: true,
            meldebeginn: true,
            meldeschluss: true,
            maxTeilnehmende: true,
            teilnahmegebuehr: true,
            beschreibung: true,
            zielgruppe: true,
            teilnahmeBedingungen: true,
            teilnahmeBedingungenPublic: true,
            datenschutz: true,
            hostname: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            description: true,
            fileId: true,
          },
        },
      },
    })
  },
})
