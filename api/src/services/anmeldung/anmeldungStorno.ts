import z from 'zod'

import prisma from '../../prisma'

export const ZAnmeldungStornoInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungStornoInputSchema = z.infer<typeof ZAnmeldungStornoInputSchema>

type AnmeldungStornoOptions = {
  input: TAnmeldungStornoInputSchema
}

export async function anmeldungStorno(options: AnmeldungStornoOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'STORNIERT',
    },
  })
}
