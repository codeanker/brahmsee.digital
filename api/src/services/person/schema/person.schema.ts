import {
  Essgewohnheit,
  Gender,
  Konfektionsgroesse,
  NahrungsmittelIntoleranz,
  Prisma,
  QualificationErsteHilfe,
  QualificationFahrerlaubnis,
  QualificationFunk,
  QualificationSanitaeter,
  QualificationSchwimmer,
} from '@prisma/client'
import { z } from 'zod'

import { addressSchema, findAddress } from '../../address/schema/address.schema'
import { kontaktSchema, type TKontaktSchema } from '../../kontakt/schema/kontakt.schema'

export type TPersonSchema = z.infer<typeof personSchema>
export const personSchema = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  birthday: z.string().datetime(),
  gender: z.nativeEnum(Gender),
  email: z.string().email(),
  telefon: z.string(),
  addresse: addressSchema,
  essgewohnheit: z.nativeEnum(Essgewohnheit),
  nahrungsmittelIntoleranzen: z.array(z.nativeEnum(NahrungsmittelIntoleranz)),
  weitereIntoleranzen: z.array(z.string()).optional(),
  qualifikationenFahrerlaubnis: z.array(z.nativeEnum(QualificationFahrerlaubnis)).optional(),
  qualifikationenSchwimmer: z.array(z.nativeEnum(QualificationSchwimmer)).optional(),
  qualifikationenErsteHilfe: z.array(z.nativeEnum(QualificationErsteHilfe)).optional(),
  qualifikationenSanitaeter: z.array(z.nativeEnum(QualificationSanitaeter)).optional(),
  qualifikationenFunk: z.array(z.nativeEnum(QualificationFunk)).optional(),
  konfektionsgroesse: z.nativeEnum(Konfektionsgroesse).optional(),
  erziehungsberechtigtePersonen: z.array(kontaktSchema).optional(),
  notfallkontaktPersonen: z.array(kontaktSchema),
})

export async function getPersonCreateData(
  input: z.infer<typeof personSchema>
): Promise<Prisma.PersonCreateArgs['data']> {
  const existingAddress = await findAddress(input.addresse)

  return {
    firstname: input.firstname,
    lastname: input.lastname,
    birthday: input.birthday,
    gender: input.gender,
    essgewohnheit: input.essgewohnheit,
    nahrungsmittelIntoleranzen: input.nahrungsmittelIntoleranzen,
    weitereIntoleranzen: input.weitereIntoleranzen,
    qualifikationenFahrerlaubnis: input.qualifikationenFahrerlaubnis,
    qualifikationenSchwimmer: input.qualifikationenSchwimmer,
    qualifikationenErsteHilfe: input.qualifikationenErsteHilfe,
    qualifikationenSanitaeter: input.qualifikationenSanitaeter,
    qualifikationenFunk: input.qualifikationenFunk,
    konfektionsgroesse: input.konfektionsgroesse,
    address: {
      connectOrCreate: {
        create: {
          zip: input.addresse.zip!,
          city: input.addresse.city!,
          street: input.addresse.street!,
          number: input.addresse.number!,
        },
        where: {
          id: existingAddress?.id,
        },
      },
    },
    notfallkontakte: {
      create: getNotfallkontakte(input.notfallkontaktPersonen, input.erziehungsberechtigtePersonen),
    },
  }
}

export function getNotfallkontakte(
  notfallkontaktPersonen: TKontaktSchema[],
  erziehungsberechtigtePersonen: TKontaktSchema[] | undefined
) {
  const notfallkontakte = [...notfallkontaktPersonen]
  if (erziehungsberechtigtePersonen) {
    notfallkontakte.push(
      ...erziehungsberechtigtePersonen.map((kontakt) => ({
        ...kontakt,
        istErziehungsberechtigt: true,
      }))
    )
  }
  return notfallkontakte
}
