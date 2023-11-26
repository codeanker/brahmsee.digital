import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungGliederungStornoInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungGliederungStornoInputSchema = z.infer<typeof ZAnmeldungGliederungStornoInputSchema>

type AnmeldungGliederungStornoOptions = AuthenticatedContext & {
  input: TAnmeldungGliederungStornoInputSchema
}

export async function anmeldungGliederungStorno(options: AnmeldungGliederungStornoOptions) {
  const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
      unterveranstaltung: {
        gliederungId: gliederung.id,
      },
    },
    data: {
      status: 'STORNIERT',
    },
    select: {
      id: true,
    },
  })
}
