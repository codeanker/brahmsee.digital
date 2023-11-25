import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { defineQuery } from '../../types/ZQuery'

export const ZUnterveranstaltungVerwaltungListInputSchema = defineQuery({
  filter: z.strictObject({
    gliederungId: z.number().optional(),
    name: z.string().optional(),
  }),
})

export type TUnterveranstaltungVerwaltungListInputSchema = z.infer<typeof ZUnterveranstaltungVerwaltungListInputSchema>

type UnterveranstaltungVerwaltungListOptions = AuthenticatedContext & {
  input: TUnterveranstaltungVerwaltungListInputSchema
}

export async function unterveranstaltungVerwaltungList(options: UnterveranstaltungVerwaltungListOptions) {
  const { skip, take } = options.input.pagination
  const where =
    options.input.filter.gliederungId != null
      ? {
          gliederungId: options.input.filter.gliederungId,
        }
      : undefined
  const veranstaltungen = await prisma.unterveranstaltung.findMany({
    skip,
    take,
    where: where,
    select: {
      id: true,
      gliederung: {
        select: {
          id: true,
          name: true,
        },
      },
      meldebeginn: true,
      meldeschluss: true,
      teilnahmegebuehr: true,
      maxTeilnehmende: true,
    },
  })

  return veranstaltungen
}
