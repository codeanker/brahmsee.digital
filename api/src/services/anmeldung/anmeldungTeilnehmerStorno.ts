import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungTeilnehmerStornoInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungTeilnehmerStornoInputSchema = z.infer<typeof ZAnmeldungTeilnehmerStornoInputSchema>

type AnmeldungTeilnehmerStornoOptions = AuthenticatedContext & {
  input: TAnmeldungTeilnehmerStornoInputSchema
}
/**
 * Storniert die Anmeldung der angemeldeten Person.
 */
export async function anmeldungTeilnehmerStorno(options: AnmeldungTeilnehmerStornoOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
      person: {
        is: {
          account: {
            is: {
              id: options.ctx.accountId,
            },
          },
        },
      },
    },
    data: {
      status: 'STORNIERT',
    },
  })
}
