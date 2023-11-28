import {
  Essgewohnheit,
  Gender,
  Konfektionsgroesse,
  NahrungsmittelIntoleranz,
  QualificationErsteHilfe,
  QualificationFahrerlaubnis,
  QualificationFunk,
  QualificationSanitaeter,
  QualificationSchwimmer,
} from '@prisma/client'
import { z } from 'zod'

import { addressDto } from '../../address/dto/address.dto'
import { kontaktDto, type TKontaktDto } from '../../kontakt/dto/kontakt.dto'

export type TPersonDto = z.infer<typeof personDto>
export const personDto = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  birthday: z.string().datetime(),
  gender: z.nativeEnum(Gender),
  email: z.string().email(),
  telefon: z.string(),
  addresse: addressDto,
  essgewohnheit: z.nativeEnum(Essgewohnheit),
  nahrungsmittelIntoleranzen: z.array(z.nativeEnum(NahrungsmittelIntoleranz)),
  weitereIntoleranzen: z.array(z.string()).optional(),
  qualifikationenFahrerlaubnis: z.array(z.nativeEnum(QualificationFahrerlaubnis)).optional(),
  qualifikationenSchwimmer: z.array(z.nativeEnum(QualificationSchwimmer)).optional(),
  qualifikationenErsteHilfe: z.array(z.nativeEnum(QualificationErsteHilfe)).optional(),
  qualifikationenSanitaeter: z.array(z.nativeEnum(QualificationSanitaeter)).optional(),
  qualifikationenFunk: z.array(z.nativeEnum(QualificationFunk)).optional(),
  konfektionsgroesse: z.nativeEnum(Konfektionsgroesse).optional(),
  erziehungsberechtigtePersonen: z.array(kontaktDto).optional(),
  notfallkontaktPersonen: z.array(kontaktDto),
})

export function getPersonCreateData(input: z.infer<typeof personDto>) {
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
      create: input.addresse,
    },
    notfallkontakte: {
      create: getNotfallkontakte(input.notfallkontaktPersonen, input.erziehungsberechtigtePersonen),
    },
  }
}

export function getNotfallkontakte(
  notfallkontaktPersonen: TKontaktDto[],
  erziehungsberechtigtePersonen: TKontaktDto[] | undefined
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
