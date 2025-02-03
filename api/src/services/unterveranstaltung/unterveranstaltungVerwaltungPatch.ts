import type { UUID } from 'crypto'

import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
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
    const documents: {
      createMany?: { data: { name: string; fileId: UUID }[] }
      updateMany?: { where: { id: number }; data: { name: string } }[]
      deleteMany?: { id: number }[]
    } = {}
    if (options.input.data?.addDocuments) {
      documents.createMany = {
        data: options.input.data.addDocuments.map((doc) => ({ ...doc, fileId: doc.fileId as UUID })),
      }
    }
    if (options.input.data?.updateDocuments) {
      documents.updateMany = options.input.data.updateDocuments.map((doc) => ({
        where: { id: doc.id },
        data: { name: doc.name },
      }))
    }
    if (options.input.data?.deleteDocumentIds) {
      documents.deleteMany = options.input.data.deleteDocumentIds.map((id) => ({ id }))
    }

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
          heroTitle: options.input.landingSettings.hero?.title,
          heroSubtitle: options.input.landingSettings.hero?.subtitle,
          eventDetailsTitle: options.input.landingSettings.eventDetails?.title,
          eventDetailsContent: options.input.landingSettings.eventDetails?.content,

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
        where: {
          unterveranstaltungId: options.input.id,
        },
      })
    }
  },
})
