import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { defineQuery } from '../../types/ZQuery'

export const ZUnterveranstaltungGliederungListInputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
})

export type TUnterveranstaltungGliederungListInputSchema = z.infer<typeof ZUnterveranstaltungGliederungListInputSchema>

type UnterveranstaltungGliederungListOptions = AuthenticatedContext & {
  input: TUnterveranstaltungGliederungListInputSchema
}

export async function unterveranstaltungGliederungList(options: UnterveranstaltungGliederungListOptions) {
  const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
  const { skip, take } = options.input.pagination
  const veranstaltungen = await prisma.unterveranstaltung.findMany({
    skip,
    take,
    where: {
      gliederungId: gliederung.id,
    },
    select: {
      id: true,
      meldebeginn: true,
      meldeschluss: true,
      teilnahmegebuehr: true,
      maxTeilnehmende: true,
    },
  })

  return veranstaltungen
}
