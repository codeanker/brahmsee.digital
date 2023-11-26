import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungGliederungAnnehmenInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungGliederungAnnehmenInputSchema = z.infer<typeof ZAnmeldungGliederungAnnehmenInputSchema>

type AnmeldungGliederungAnnehmenOptions = AuthenticatedContext & {
  input: TAnmeldungGliederungAnnehmenInputSchema
}

export async function anmeldungGliederungAnnehmen(options: AnmeldungGliederungAnnehmenOptions) {
  const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
      unterveranstaltung: {
        gliederungId: gliederung.id,
      },
    },
    data: {
      status: 'ANGENOMMEN',
    },
    select: {
      id: true,
    },
  })
}
