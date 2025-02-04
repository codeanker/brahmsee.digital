import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { unterveranstaltungLandingSchema, unterveranstaltungUpdateSchema } from './schema/unterveranstaltung.schema.js'
import { crudFiles } from './schema/crudFiles.js'
import { crudMiscellaneousItems } from './schema/crudMiscellaneousItems.js'

export const unterveranstaltungGliederungPatchProcedure = defineProtectedMutateProcedure({
  key: 'gliederungPatch',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: unterveranstaltungUpdateSchema.partial().optional(),
    landingSettings: unterveranstaltungLandingSchema.partial().optional(),
  }),
  async handler(options) {
    await getGliederungRequireAdmin(options.ctx.accountId)

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
          heroImages: heroImages,
          miscellaneousItems: miscellaneousItems,
        },
        where: {
          unterveranstaltungId: options.input.id,
        },
      })
    }
  },
})
