import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungTeilnehmerStornoInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
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
  const anmeldung = await prisma.anmeldung.findFirstOrThrow({
    where: {
      unterveranstaltungId: options.input.data.unterveranstaltungId,
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
    select: {
      id: true,
    },
  })
  return prisma.anmeldung.update({
    where: {
      id: anmeldung.id,
    },
    data: {
      status: 'STORNIERT',
    },
  })
}
