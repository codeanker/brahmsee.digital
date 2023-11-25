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
  const veranstaltung = await prisma.veranstaltung.findUnique({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
      name: true,
      beginn: true,
      ende: true,
      ort: true,
      meldebeginn: true,
      meldeschluss: true,
      maxTeilnehmende: true,
      teilnahmegebuehr: true,
    },
  })
  const anmeldungen = await prisma.anmeldung.findMany({
    where: {
      unterveranstaltung: {
        is: {
          veranstaltungId: options.input.id,
        },
      },
    },
    select: {
      person: {
        select: {
          firstname: true,
          lastname: true,
          birthday: true,
        },
      },
    },
  })
  return {
    veranstaltung,
    anmeldungen,
  }
}
