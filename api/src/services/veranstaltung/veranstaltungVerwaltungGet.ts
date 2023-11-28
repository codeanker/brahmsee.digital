import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZVeranstaltungVerwaltungGetInputSchema = z.strictObject({
  id: z.number(),
})

export type TVeranstaltungVerwaltungGetInputSchema = z.infer<typeof ZVeranstaltungVerwaltungGetInputSchema>

type VeranstaltungVerwaltungGetOptions = AuthenticatedContext & {
  input: TVeranstaltungVerwaltungGetInputSchema
}

export async function veranstaltungVerwaltungGet(options: VeranstaltungVerwaltungGetOptions) {
  const veranstaltungWithunterveranstaltungen = await prisma.veranstaltung.findUniqueOrThrow({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
      name: true,
      beginn: true,
      ende: true,
      ort: {
        select: {
          name: true,
        },
      },
      unterveranstaltungen: {
        select: {
          Anmeldung: {
            select: {
              person: {
                select: {
                  firstname: true,
                  lastname: true,
                  birthday: true,
                },
              },
            },
          },
        },
      },
      meldebeginn: true,
      meldeschluss: true,
      maxTeilnehmende: true,
      teilnahmegebuehr: true,
      beschreibung: true,
      datenschutz: true,
      teilnahmeBedingungen: true,
      zielgruppe: true,
    },
  })
  const { unterveranstaltungen, ...veranstaltung } = veranstaltungWithunterveranstaltungen
  const anmeldungen = unterveranstaltungen.flatMap((u) => u.Anmeldung)
  return {
    ...veranstaltung,
    anmeldungen,
  }
}
