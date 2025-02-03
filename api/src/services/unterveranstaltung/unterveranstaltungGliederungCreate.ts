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
  async handler({ ctx, input }) {
    // check logged in user is admin of gliederung
    const gliederung = await getGliederungRequireAdmin(ctx.accountId)
    const veranstaltung = await prisma.veranstaltung.findUniqueOrThrow({
      where: {
        id: input.data.veranstaltungId,
      },
      select: {
        meldebeginn: true,
        meldeschluss: true,
      },
    })
    // check meldebegin is after parent meldebeginn
    if (new Date(input.data.meldebeginn) < veranstaltung.meldebeginn) {
      throw new TRPCError({
        message: 'Der Meldebeginn darf nicht vor dem Meldebeginn der übergeordneten Veranstaltung liegen',
        code: 'BAD_REQUEST',
      })
    }
    // check meldeschluss is before parent meldeschluss
    if (new Date(input.data.meldeschluss) > veranstaltung.meldeschluss) {
      throw new TRPCError({
        message: 'Der Meldeschluss darf nicht nach dem Meldeschluss der übergeordneten Veranstaltung liegen',
        code: 'BAD_REQUEST',
      })
    }

    const unterveranstaltung = await prisma.unterveranstaltung.create({
      data: {
        ...input.data,
        type: 'GLIEDERUNG',
        gliederungId: gliederung.id,
      },
      select: {
        id: true,
      },
    })

    await prisma.unterveranstaltungLandingSettings.create({
      data: {
        unterveranstaltungId: unterveranstaltung.id,
        heroTitle: input.landingSettings.hero.title,
        heroSubtitle: input.landingSettings.hero.subtitle,
        eventDetailsTitle: input.landingSettings.eventDetails.title,
        eventDetailsContent: input.landingSettings.eventDetails.content,

        miscellaneousVisible: input.landingSettings.miscellaneous?.visible ?? false,
        miscellaneousTitle: input.landingSettings.miscellaneous?.title,
        miscellaneousItems: input.landingSettings.miscellaneous?.items
          ? {
              createMany: {
                data: input.landingSettings.miscellaneous.items.map((item) => ({
                  title: item.title,
                  content: item.content,
                })),
              },
            }
          : undefined,
        faqVisible: input.landingSettings.faq?.visible ?? false,
        faqEmail: input.landingSettings.faq?.email,
      },
    })
  },
})
