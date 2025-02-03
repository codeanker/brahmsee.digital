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
  hero: z.strictObject({
    title: z.string(),
    subtitle: z.string(),
    images: z
      .array(
        z.strictObject({
          name: z.string(),
          fileId: z.string().uuid(),
        })
      )
      .optional(),
  }),
  eventDetails: z.strictObject({
    title: z.string(),
    content: z.string(),
  }),
  miscellaneous: z
    .strictObject({
      visible: z.boolean(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      items: z
        .array(
          z.strictObject({
            title: z.string(),
            content: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
  faq: z
    .strictObject({
      visible: z.boolean(),
      email: z.string().email().optional(),
      items: z
        .array(
          z.strictObject({
            question: z.string(),
            answer: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
})

export type TUnterveranstaltungLandingSchema = z.infer<typeof unterveranstaltungLandingSchema>
