import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { unterveranstaltungCreateSchema, unterveranstaltungLandingSchema } from './schema/unterveranstaltung.schema.js'

export const unterveranstaltungGliederungCreateProcedure = defineProtectedMutateProcedure({
  key: 'gliederungCreate',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    data: unterveranstaltungCreateSchema,
    landingSettings: unterveranstaltungLandingSchema,
  }),
  async handler(options) {
    // check logged in user is admin of gliederung
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
    const veranstaltung = await prisma.veranstaltung.findUniqueOrThrow({
      where: {
        id: options.input.data.veranstaltungId,
      },
      select: {
        meldebeginn: true,
        meldeschluss: true,
      },
    })
    // check meldebegin is after parent meldebeginn
    if (new Date(options.input.data.meldebeginn) < veranstaltung.meldebeginn) {
      throw new TRPCError({
        message: 'Der Meldebeginn darf nicht vor dem Meldebeginn der übergeordneten Veranstaltung liegen',
        code: 'BAD_REQUEST',
      })
    }
    // check meldeschluss is before parent meldeschluss
    if (new Date(options.input.data.meldeschluss) > veranstaltung.meldeschluss) {
      throw new TRPCError({
        message: 'Der Meldeschluss darf nicht nach dem Meldeschluss der übergeordneten Veranstaltung liegen',
        code: 'BAD_REQUEST',
      })
    }

    const unterveranstaltung = await prisma.unterveranstaltung.create({
      data: {
        ...options.input.data,
        type: 'GLIEDERUNG',
        gliederungId: gliederung.id,
      },
      select: {
        id: true,
      },
    })

    const landingSettings = await prisma.unterveranstaltungLandingSettings.create({
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

    const faq = await prisma.faq.createMany({
      data: options.input.landingSettings.faq?.items
        ? options.input.landingSettings.faq.items.map((item) => ({
            unterveranstaltungId: unterveranstaltung.id,
            question: item.question,
            answer: item.answer,
            category: 'DEFAULT',
          }))
        : [],
    })

    return { unterveranstaltung, landingSettings, faq }
  },
})
