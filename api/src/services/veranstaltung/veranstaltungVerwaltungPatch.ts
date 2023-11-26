import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZVeranstaltungVerwaltungPatchInputSchema = z.strictObject({
  data: z.strictObject({
    id: z.number(),
    name: z.string().optional(),
    beginn: z.date().optional(),
    ende: z.date().optional(),
    ort: z.string().optional(),
    meldebeginn: z.date().optional(),
    meldeschluss: z.date().optional(),
    maxTeilnehmende: z.number().int().optional(),
    teilnahmegebuehr: z.number().int().optional(),
    beschreibung: z.string().optional(),
    datenschutz: z.string().optional(),
    teilnahmeBedigungen: z.string().optional(),
  }),
})

export type TVeranstaltungVerwaltungPatchInputSchema = z.infer<typeof ZVeranstaltungVerwaltungPatchInputSchema>

type VeranstaltungVerwaltungPatchOptions = AuthenticatedContext & {
  input: TVeranstaltungVerwaltungPatchInputSchema
}

export async function veranstaltungVerwaltungPatch(options: VeranstaltungVerwaltungPatchOptions) {
  return prisma.veranstaltung.update({
    where: {
      id: options.input.data.id,
    },
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
