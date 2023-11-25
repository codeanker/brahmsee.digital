import z from 'zod'

import prisma from '../../prisma'

export const ZVeranstaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    beginn: z.date(),
    ende: z.date(),
    ort: z.string(),
    meldebeginn: z.date(),
    meldeschluss: z.date(),
    maxTeilnehmende: z.string(),
    teilnahmegebuehr: z.string(),
  }),
})

export type TVeranstaltungCreateInputSchema = z.infer<typeof ZVeranstaltungCreateInputSchema>

type VeranstaltungCreateOptions = {
  input: TVeranstaltungCreateInputSchema
}

export async function veranstaltungCreate(options: VeranstaltungCreateOptions) {
  return prisma.veranstaltung.create({
    data: {
      ...options.input.data,
      teilnahmegebuehr: parseInt(options.input.data.teilnahmegebuehr),
      maxTeilnehmende: parseInt(options.input.data.maxTeilnehmende),
    },
    select: {
      id: true,
    },
  })
}
