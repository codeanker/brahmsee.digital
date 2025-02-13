import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const unterveranstaltungGliederungGetProcedure = defineProtectedQueryProcedure({
  key: 'gliederungGet',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  handler: (options) =>
    prisma.unterveranstaltung.findUniqueOrThrow({
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
        gliederung: {
          select: {
            id: true,
            name: true,
            edv: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            description: true,
            fileId: true,
            file: {
              select: {
                id: true,
                filename: true,
                mimetype: true,
                createdAt: true,
              },
            },
          },
        },
        landingSettings: {
          select: {
            eventDetailsContent: true,
            eventDetailsTitle: true,
            faqEmail: true,
            faqVisible: true,
            heroImages: {
              select: {
                id: true,
                name: true,
                file: true,
              },
            },
            heroSubtitle: true,
            heroTitle: true,
            miscellaneousItems: {
              select: {
                id: true,
                title: true,
                content: true,
              },
            },
            miscellaneousTitle: true,
            miscellaneousSubtitle: true,
            miscellaneousVisible: true,
          },
        },
      },
    }),
})
