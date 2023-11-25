import z from 'zod'

import prisma from '../../prisma'

export const ZUnterveranstaltungGetInputSchema = z.strictObject({
  id: z.number(),
})

export type TUnterveranstaltungGetInputSchema = z.infer<typeof ZUnterveranstaltungGetInputSchema>

type UnterveranstaltungGetOptions = {
  input: TUnterveranstaltungGetInputSchema
}

export async function unterveranstaltungGet(options: UnterveranstaltungGetOptions) {
  const unterveranstaltung = await prisma.unterveranstaltung.findFirstOrThrow({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
      veranstaltungId: true,
      meldebeginn: true,
      meldeschluss: true,
      maxTeilnehmende: true,
      teilnahmegebuehr: true,
      veranstaltung: {
        select: {
          beginn: true,
          ende: true,
          ort: true,
        },
      },
      gliederung: {
        select: {
          name: true,
        },
      },
    },
  })
  return unterveranstaltung
}
