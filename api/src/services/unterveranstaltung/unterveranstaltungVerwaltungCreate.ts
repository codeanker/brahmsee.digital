import { Role, UnterveranstaltungType } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { unterveranstaltungCreateSchema, unterveranstaltungLandingSchema } from './schema/unterveranstaltung.schema.js'

const unterveranstaltungVerwaltungCreateSchema = unterveranstaltungCreateSchema.extend({
  gliederungId: z.number().int(),
  type: z.nativeEnum(UnterveranstaltungType),
})

export const unterveranstaltungVerwaltungCreateProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungCreate',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    data: unterveranstaltungVerwaltungCreateSchema,
    landingSettings: unterveranstaltungLandingSchema,
  }),
  async handler(options) {
    const unterveranstaltung = await prisma.unterveranstaltung.create({
      data: options.input.data,
      select: {
        id: true,
      },
    })

    await prisma.unterveranstaltungLandingSettings.create({
      data: {
        unterveranstaltungId: unterveranstaltung.id,
        heroTitle: options.input.landingSettings.heroTitle,
        heroSubtitle: options.input.landingSettings.heroSubtitle,
        eventDetailsTitle: options.input.landingSettings.eventDetailsTitle,
        eventDetailsContent: options.input.landingSettings.eventDetailsContent,

        miscellaneousVisible: options.input.landingSettings.miscellaneousVisible,
        miscellaneousTitle: options.input.landingSettings.miscellaneousTitle,
        miscellaneousItems: options.input.landingSettings.miscellaneousItems
          ? {
              createMany: {
                data: options.input.landingSettings.miscellaneousItems.map((item) => ({
                  title: item.title,
                  content: item.content,
                })),
              },
            }
          : undefined,

        faqVisible: options.input.landingSettings.faqVisible,
        faqEmail: options.input.landingSettings.faqEmail,
      },
    })
  },
})
