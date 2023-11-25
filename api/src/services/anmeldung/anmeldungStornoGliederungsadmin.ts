import z from 'zod'

import { throwIfNotGliederungsadmin } from '../../helpers/throwIfNotGliederungsadmin'
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
  const anmeldung = await prisma.anmeldung.findFirstOrThrow({
    where: {
      id: options.input.data.anmeldungId,
    },
    select: {
      id: true,
      unterveranstaltung: {
        select: {
          id: true,
          gliederungId: true,
        },
      },
    },
  })

  await throwIfNotGliederungsadmin({
    accountId: options.ctx.accountId,
    gliederungId: anmeldung.unterveranstaltung.gliederungId,
  })

  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'STORNIERT',
    },
    select: {
      id: true,
    },
  })
}
