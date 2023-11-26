import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungGliederungAblehnenInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungGliederungAblehnenInputSchema = z.infer<typeof ZAnmeldungGliederungAblehnenInputSchema>

type AnmeldungGliederungAblehnenOptions = AuthenticatedContext & {
  input: TAnmeldungGliederungAblehnenInputSchema
}

export async function anmeldungGliederungAblehnen(options: AnmeldungGliederungAblehnenOptions) {
  const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
      unterveranstaltung: {
        gliederungId: gliederung.id,
      },
    },
    data: {
      status: 'ABGELEHNT',
    },
    select: {
      id: true,
    },
  })
}
