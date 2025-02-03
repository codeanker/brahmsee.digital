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
  heroImages: z
    .array(
      z.strictObject({
        name: z.string(),
        fileId: z.string().uuid(),
      })
    )
    .optional(),

  eventDetails: z.string(),
  eventContent: z.string(),

  miscellaneousVisible: z.boolean().optional(),
  miscellaneousTitle: z.string().optional(),
  miscellaneousSubtitle: z.string().optional(),
  miscellaneousItems: z
    .array(
      z.strictObject({
        title: z.string(),
        content: z.string(),
      })
    )
    .optional(),

  faqVisible: z.boolean().optional(),
  faqEmail: z.string().optional(),

  instagramVisible: z.boolean().optional(),
  instagramTitle: z.string().optional(),

  facebookVisible: z.boolean().optional(),
  facebookTitle: z.string().optional(),
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
