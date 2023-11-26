import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZVeranstaltungVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    beginn: z.date(),
    ende: z.date(),
    ort: z.string(),
    meldebeginn: z.date(),
    meldeschluss: z.date(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number().int(),
    beschreibung: z.string().optional(),
  }),
})

export type TVeranstaltungVerwaltungCreateInputSchema = z.infer<typeof ZVeranstaltungVerwaltungCreateInputSchema>

type VeranstaltungVerwaltungCreateOptions = AuthenticatedContext & {
  input: TVeranstaltungVerwaltungCreateInputSchema
}

export async function veranstaltungVerwaltungCreate(options: VeranstaltungVerwaltungCreateOptions) {
  return prisma.veranstaltung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
