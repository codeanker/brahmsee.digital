import z from 'zod'

import prisma from '../../prisma'

export const ZVeranstaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    beginn: z.string().datetime(),
    ende: z.string().datetime(),
    ort: z.string(),
    meldebeginn: z.string().datetime(),
    meldeschluss: z.string().datetime(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
  }),
})

export type TVeranstaltungCreateInputSchema = z.infer<typeof ZVeranstaltungCreateInputSchema>

type VeranstaltungCreateOptions = {
  input: TVeranstaltungCreateInputSchema
}

export async function veranstaltungCreate(options: VeranstaltungCreateOptions) {
  return prisma.veranstaltung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
