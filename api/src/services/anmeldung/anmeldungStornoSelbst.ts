import z from 'zod'

import prisma from '../../prisma'

export const ZAnmeldungStornoSelfInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
  }),
})

export type TAnmeldungStornoSelfInputSchema = z.infer<typeof ZAnmeldungStornoSelfInputSchema>

type AnmeldungStornoSelfOptions = {
  input: TAnmeldungStornoSelfInputSchema
  ctx: {
    accountId: number
  }
}
/**
 * Storniert die Anmeldung der angemeldeten Person.
 */
export async function anmeldungStornoSelf(options: AnmeldungStornoSelfOptions) {
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
