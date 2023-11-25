import z from 'zod'

import prisma from '../../prisma'

export const ZUnterveranstaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    veranstaltungId: z.number().int(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
    meldebeginn: z.string().datetime(),
    meldeschluss: z.string().datetime(),
    gliederungId: z.number().int(),
  }),
})

export type TUnterveranstaltungCreateInputSchema = z.infer<typeof ZUnterveranstaltungCreateInputSchema>

type UnterveranstaltungCreateOptions = {
  input: TUnterveranstaltungCreateInputSchema
}

export async function unterveranstaltungCreate(options: UnterveranstaltungCreateOptions) {
  return prisma.unterveranstaltung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
