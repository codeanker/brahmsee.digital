import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { defineQuery } from '../../types/ZQuery'

export const ZVeranstaltungenVerwaltungListInputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
})

export type TVeranstaltungenVerwaltungListInputSchema = z.infer<typeof ZVeranstaltungenVerwaltungListInputSchema>

type VeranstaltungenVerwaltungListOptions = AuthenticatedContext & {
  input: TVeranstaltungenVerwaltungListInputSchema
}

export async function veranstaltungenVerwaltungList(options: VeranstaltungenVerwaltungListOptions) {
  const { skip, take } = options.input.pagination
  const veranstaltungen = await prisma.veranstaltung.findMany({
    skip,
    take,
    select: {
      id: true,
      name: true,
      beginn: true,
      ende: true,
      ort: {
        select: {
          name: true,
        },
      },
      meldebeginn: true,
      meldeschluss: true,
      maxTeilnehmende: true,
      teilnahmegebuehr: true,
      unterveranstaltungen: {
        select: {
          id: true,
          maxTeilnehmende: true,
          teilnahmegebuehr: true,
          meldebeginn: true,
          meldeschluss: true,
          gliederungId: true,
        },
      },
    },
  })

  return veranstaltungen
}
