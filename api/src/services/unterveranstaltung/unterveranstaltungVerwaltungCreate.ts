import z from 'zod'

import prisma from '../../prisma'

export const ZUnterveranstaltungVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    veranstaltungId: z.number().int(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
    meldebeginn: z.string().datetime(),
    meldeschluss: z.string().datetime(),
    gliederungId: z.number().int(),
  }),
})

export type TUnterveranstaltungVerwaltungCreateInputSchema = z.infer<
  typeof ZUnterveranstaltungVerwaltungCreateInputSchema
>

type UnterveranstaltungVerwaltungCreateOptions = {
  input: TUnterveranstaltungVerwaltungCreateInputSchema
}

export async function unterveranstaltungVerwaltungCreate(options: UnterveranstaltungVerwaltungCreateOptions) {
  return prisma.unterveranstaltung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
