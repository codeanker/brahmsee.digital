import { z } from 'zod'

export const unterveranstaltungCreateSchema = z.strictObject({
  veranstaltungId: z.number().int(),
  maxTeilnehmende: z.number().int(),
  teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
  meldebeginn: z.date(),
  meldeschluss: z.date(),
  beschreibung: z.string().optional(),
  bedingungen: z.string().optional(),
})

export type TUnterveranstaltungCreateSchema = z.infer<typeof unterveranstaltungCreateSchema>

export const unterveranstaltungLandingSchema = z.strictObject({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  addHeroImages: z
    .array(
      z.strictObject({
        name: z.string(),
        fileId: z.string().uuid(),
      })
    )
    .optional(),
  updateHeroImages: z.array(z.strictObject({ id: z.number().int(), name: z.string() })).optional(),
  deleteHeroImageIds: z.array(z.number().int()).optional(),

  eventDetailsTitle: z.string(),
  eventDetailsContent: z.string(),

  miscellaneousVisible: z.boolean().optional(),
  miscellaneousTitle: z.string().optional(),
  miscellaneousSubtitle: z.string().optional(),

  addMiscellaneousItems: z
    .array(
      z.strictObject({
        title: z.string(),
        content: z.string(),
      })
    )
    .optional(),
  updateMiscellaneousItems: z
    .array(z.strictObject({ id: z.number().int(), title: z.string(), content: z.string() }))
    .optional(),
  deleteMiscellaneousItemIds: z.array(z.number().int()).optional(),

  faqVisible: z.boolean().optional(),
  faqEmail: z.string().optional(),

  instagramVisible: z.boolean().optional(),
  instagramUrl: z.string().optional(),

  facebookVisible: z.boolean().optional(),
  facebookUrl: z.string().optional(),
})

export const unterveranstaltungUpdateSchema = unterveranstaltungCreateSchema.omit({ veranstaltungId: true }).extend({
  addDocuments: z
    .array(
      z.strictObject({
        name: z.string(),
        fileId: z.string().uuid(),
      })
    )
    .optional(),
  updateDocuments: z.array(z.strictObject({ id: z.number().int(), name: z.string() })).optional(),
  deleteDocumentIds: z.array(z.number().int()).optional(),
})

export type TUnterveranstaltungLandingSchema = z.infer<typeof unterveranstaltungLandingSchema>
