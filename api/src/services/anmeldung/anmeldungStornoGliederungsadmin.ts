import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungStornoGliederungsadminInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungStornoGliederungsadminInputSchema = z.infer<typeof ZAnmeldungStornoGliederungsadminInputSchema>

type AnmeldungStornoGliederungsadminOptions = AuthenticatedContext & {
  input: TAnmeldungStornoGliederungsadminInputSchema
}

export async function anmeldungStornoGliederungsadmin(options: AnmeldungStornoGliederungsadminOptions) {
  const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

  const anmeldung = await prisma.anmeldung.findFirstOrThrow({
    where: {
      id: options.input.data.anmeldungId,
      unterveranstaltung: {
        gliederungId: gliederung.id,
      },
    },
    select: {
      id: true,
      unterveranstaltung: {
        select: {
          id: true,
        },
      },
    },
  })

  return prisma.anmeldung.update({
    where: {
      id: anmeldung.id,
    },
    data: {
      status: 'STORNIERT',
    },
    select: {
      id: true,
    },
  })
}
