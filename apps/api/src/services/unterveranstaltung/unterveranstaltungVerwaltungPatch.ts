import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { crudFiles } from './schema/crudFiles.js'
import { crudMiscellaneousItems } from './schema/crudMiscellaneousItems.js'
import { unterveranstaltungLandingSchema, unterveranstaltungUpdateSchema } from './schema/unterveranstaltung.schema.js'

export const unterveranstaltungVerwaltungPatchProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungPatch',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: unterveranstaltungUpdateSchema.partial().optional(),
    landingSettings: unterveranstaltungLandingSchema.partial().optional(),
  }),
  async handler(options) {
    // Documents create, update, delete
    const documents = crudFiles(
      options.input.data?.addDocuments,
      options.input.data?.updateDocuments,
      options.input.data?.deleteDocumentIds
    )

    const heroImages = crudFiles(
      options.input.landingSettings?.addHeroImages,
      options.input.landingSettings?.updateHeroImages,
      options.input.landingSettings?.deleteHeroImageIds
    )

    const miscellaneousItems = crudMiscellaneousItems(
      options.input.landingSettings?.addMiscellaneousItems,
      options.input.landingSettings?.updateMiscellaneousItems,
      options.input.landingSettings?.deleteMiscellaneousItemIds
    )

    if (options.input.data) {
      await prisma.unterveranstaltung.update({
        where: {
          id: options.input.id,
        },
        data: {
          maxTeilnehmende: options.input.data.maxTeilnehmende,
          teilnahmegebuehr: options.input.data.teilnahmegebuehr,
          meldebeginn: options.input.data.meldebeginn,
          meldeschluss: options.input.data.meldeschluss,
          beschreibung: options.input.data.beschreibung,
          bedingungen: options.input.data.bedingungen,
          documents: documents,
        },
      })
    }

    if (options.input.landingSettings) {
      await prisma.unterveranstaltungLandingSettings.update({
        data: {
          heroTitle: options.input.landingSettings.heroTitle,
          heroSubtitle: options.input.landingSettings.heroSubtitle,
          eventDetailsTitle: options.input.landingSettings.eventDetailsTitle,
          eventDetailsContent: options.input.landingSettings.eventDetailsContent,
          miscellaneousVisible: options.input.landingSettings.miscellaneousVisible,
          miscellaneousTitle: options.input.landingSettings.miscellaneousTitle,
          miscellaneousSubtitle: options.input.landingSettings.miscellaneousSubtitle,
          faqVisible: options.input.landingSettings.faqVisible,
          faqEmail: options.input.landingSettings.faqEmail,
          heroImages: heroImages,
          miscellaneousItems: miscellaneousItems,
          facebookUrl: options.input.landingSettings.facebookUrl,
          instagramUrl: options.input.landingSettings.instagramUrl,
        },
        where: {
          unterveranstaltungId: options.input.id,
        },
      })
    }
  },
})
