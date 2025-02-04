import { Role, UnterveranstaltungType } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { unterveranstaltungCreateSchema, unterveranstaltungLandingSchema } from './schema/unterveranstaltung.schema.js'
import { crudMiscellaneousItems } from './schema/crudMiscellaneousItems.js'
import { crudFiles } from './schema/crudFiles.js'

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
  async handler({ input }) {
    const heroImages = crudFiles(
      input.landingSettings?.addHeroImages,
      input.landingSettings?.updateHeroImages,
      input.landingSettings?.deleteHeroImageIds
    )

    const miscellaneousItems = crudMiscellaneousItems(
      input.landingSettings?.addMiscellaneousItems,
      input.landingSettings?.updateMiscellaneousItems,
      input.landingSettings?.deleteMiscellaneousItemIds
    )

    const unterveranstaltung = await prisma.unterveranstaltung.create({
      data: {
        veranstaltung: {
          connect: {
            id: input.data.veranstaltungId,
          },
        },
        maxTeilnehmende: input.data.maxTeilnehmende,
        teilnahmegebuehr: input.data.teilnahmegebuehr,
        meldebeginn: input.data.meldebeginn,
        meldeschluss: input.data.meldeschluss,
        beschreibung: input.data.beschreibung,
        bedingungen: input.data.bedingungen,
        type: 'GLIEDERUNG',
        gliederung: {
          connect: {
            id: input.data.gliederungId,
          },
        },
        landingSettings: {
          create: {
            heroTitle: input.landingSettings.heroTitle,
            heroSubtitle: input.landingSettings.heroSubtitle,
            heroImages: heroImages,
            eventDetailsTitle: input.landingSettings.eventDetailsTitle,
            eventDetailsContent: input.landingSettings.eventDetailsContent,
            miscellaneousVisible: input.landingSettings.miscellaneousVisible,
            miscellaneousTitle: input.landingSettings.miscellaneousTitle,
            miscellaneousSubtitle: input.landingSettings.miscellaneousSubtitle,
            miscellaneousItems: miscellaneousItems,
          },
        },
      },
      select: {
        id: true,
      },
    })

    return unterveranstaltung
  },
})
