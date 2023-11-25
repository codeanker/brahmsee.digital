import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZVeranstaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    beginn: z.date(),
    ende: z.date(),
    ort: z.string(),
    meldebeginn: z.date(),
    meldeschluss: z.date(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number().int(),
  }),
})

export type TVeranstaltungCreateInputSchema = z.infer<typeof ZVeranstaltungCreateInputSchema>

type VeranstaltungCreateOptions = AuthenticatedContext & {
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
