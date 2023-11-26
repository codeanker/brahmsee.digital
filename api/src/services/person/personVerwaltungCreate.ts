import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

import { getNotfallkontakte } from './helpers/getNotfallkontakte'
import { personInput } from './helpers/personInput'

export const ZPersonVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject(personInput),
})

export type TPersonVerwaltungCreateInputSchema = z.infer<typeof ZPersonVerwaltungCreateInputSchema>

type PersonVerwaltungCreateOptions = AuthenticatedContext & {
  input: TPersonVerwaltungCreateInputSchema
}

export async function personVerwaltungCreate(options: PersonVerwaltungCreateOptions) {
  const notfallKontakte = getNotfallkontakte(
    options.input.data.notfallkontaktPersonen,
    options.input.data.erziehungsberechtigtePersonen
  )
  return prisma.person.create({
    data: {
      firstname: options.input.data.firstname,
      lastname: options.input.data.lastname,
      birthday: options.input.data.birthday,
      gender: options.input.data.gender,
      essgewohnheit: options.input.data.essgewohnheit,
      nahrungsmittelIntoleranzen: options.input.data.nahrungsmittelIntoleranzen,
      weitereIntoleranzen: options.input.data.weitereIntoleranzen,
      qualifikationenFahrerlaubnis: options.input.data.qualifikationenFahrerlaubnis,
      qualifikationenSchwimmer: options.input.data.qualifikationenSchwimmer,
      qualifikationenErsteHilfe: options.input.data.qualifikationenErsteHilfe,
      qualifikationenSanitaeter: options.input.data.qualifikationenSanitaeter,
      qualifikationenFunk: options.input.data.qualifikationenFunk,
      konfektionsgroesse: options.input.data.konfektionsgroesse,
      addresses: {
        create: options.input.data.addresse,
      },
      notfallkontakte: {
        create: notfallKontakte,
      },
    },
    select: {
      id: true,
    },
  })
}
