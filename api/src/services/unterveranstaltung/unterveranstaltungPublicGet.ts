import z from 'zod'

import prisma from '../../prisma'

export const ZUnterveranstaltungPublicGetInputSchema = z.strictObject({
  id: z.number(),
})

export type TUnterveranstaltungPublicGetInputSchema = z.infer<typeof ZUnterveranstaltungPublicGetInputSchema>

type UnterveranstaltungPublicGetOptions = {
  input: TUnterveranstaltungPublicGetInputSchema
}

export async function unterveranstaltungPublicGet(options: UnterveranstaltungPublicGetOptions) {
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
      type: true,
      veranstaltung: {
        select: {
          beginn: true,
          ende: true,
          ort: true,
          datenschutz: true,
          teilnahmeBedingungen: true,
          zielgruppe: true,
        },
      },
      gliederung: {
        select: {
          name: true,
        },
      },
      beschreibung: true,
    },
  })
  return unterveranstaltung
}
