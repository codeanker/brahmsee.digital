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

import { kontaktInput } from './kontaktInput'

export const personInput = {
  firstname: z.string(),
  lastname: z.string(),
  birthday: z.string().datetime(),
  gender: z.nativeEnum(Gender),
  email: z.string().email(),
  telefon: z.string(),
  addresse: z.strictObject({
    street: z.string(),
    number: z.string(),
    zip: z.string(),
    city: z.string(),
  }),
  essgewohnheit: z.nativeEnum(Essgewohnheit),
  nahrungsmittelIntoleranzen: z.array(z.nativeEnum(NahrungsmittelIntoleranz)),
  weitereIntoleranzen: z.array(z.string()).optional(),
  qualifikationenFahrerlaubnis: z.array(z.nativeEnum(QualificationFahrerlaubnis)).optional(),
  qualifikationenSchwimmer: z.array(z.nativeEnum(QualificationSchwimmer)).optional(),
  qualifikationenErsteHilfe: z.array(z.nativeEnum(QualificationErsteHilfe)).optional(),
  qualifikationenSanitaeter: z.array(z.nativeEnum(QualificationSanitaeter)).optional(),
  qualifikationenFunk: z.array(z.nativeEnum(QualificationFunk)).optional(),
  konfektionsgroesse: z.nativeEnum(Konfektionsgroesse).optional(),
  erziehungsberechtigtePersonen: z.array(kontaktInput).optional(),
  notfallkontaktPersonen: z.array(kontaktInput),
}
