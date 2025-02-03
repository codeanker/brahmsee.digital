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
        heroTitle: options.input.landingSettings.hero.title,
        heroSubtitle: options.input.landingSettings.hero.subtitle,
        eventDetailsTitle: options.input.landingSettings.eventDetails.title,
        eventDetailsContent: options.input.landingSettings.eventDetails.content,

        miscellaneousVisible: options.input.landingSettings.miscellaneous?.visible ?? false,
        miscellaneousTitle: options.input.landingSettings.miscellaneous?.title,
        miscellaneousItems: options.input.landingSettings.miscellaneous?.items
          ? {
              createMany: {
                data: options.input.landingSettings.miscellaneous.items.map((item) => ({
                  title: item.title,
                  content: item.content,
                })),
              },
            }
          : undefined,
        faqVisible: options.input.landingSettings.faq?.visible ?? false,
        faqEmail: options.input.landingSettings.faq?.email,
      },
      select: {
        id: true,
      },
    })

    await prisma.faq.createMany({
      data: options.input.landingSettings.faq?.items
        ? options.input.landingSettings.faq.items.map((item) => ({
            unterveranstaltungId: unterveranstaltung.id,
            question: item.question,
            answer: item.answer,
            category: 'DEFAULT',
          }))
        : [],
    })

    return unterveranstaltung
  },
})
