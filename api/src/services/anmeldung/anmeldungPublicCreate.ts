import {
  Essgewohnheit,
  Konfektionsgroesse,
  NahrungsmittelIntoleranz,
  QualificationErsteHilfe,
  QualificationFahrerlaubnis,
  QualificationFunk,
  QualificationSanitaeter,
  QualificationSchwimmer,
} from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'

export const ZAnmeldungPublicCreateInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
    firstname: z.string(),
    lastname: z.string(),
    birthday: z.string().datetime(),
    email: z.string().email(),
    telefon: z.string(),
    essgewohnheit: z.nativeEnum(Essgewohnheit),
    nahrungsmittelIntoleranzen: z.array(z.nativeEnum(NahrungsmittelIntoleranz)),
    weitereIntoleranzen: z.array(z.string()).optional(),
    qualifikationenFahrerlaubnis: z.array(z.nativeEnum(QualificationFahrerlaubnis)).optional(),
    qualifikationenSchwimmer: z.array(z.nativeEnum(QualificationSchwimmer)).optional(),
    qualifikationenErsteHilfe: z.array(z.nativeEnum(QualificationErsteHilfe)).optional(),
    qualifikationenSanitaeter: z.array(z.nativeEnum(QualificationSanitaeter)).optional(),
    qualifikationenFunk: z.array(z.nativeEnum(QualificationFunk)).optional(),
    konfektionsgroesse: z.nativeEnum(Konfektionsgroesse).optional(),
    erziehungsberechtigtePersonen: z
      .array(
        z.strictObject({
          firstname: z.string(),
          lastname: z.string(),
          telefon: z.string(),
        })
      )
      .optional(),
    notfallkontaktPersonen: z.array(
      z.strictObject({
        firstname: z.string(),
        lastname: z.string(),
        telefon: z.string(),
      })
    ),
    mahlzeitenIds: z.array(z.number().int()).optional(),
    uebernachtungsTage: z.array(z.date()).optional(),
    tshirtBestellt: z.boolean().optional(),
  }),
})

export type TAnmeldungPublicCreateInputSchema = z.infer<typeof ZAnmeldungPublicCreateInputSchema>

type AnmeldungPublicCreateOptions = {
  input: TAnmeldungPublicCreateInputSchema
}

export async function anmeldungPublicCreate(options: AnmeldungPublicCreateOptions) {
  const unterveranstaltung = await prisma.unterveranstaltung.findFirstOrThrow({
    where: {
      id: options.input.data.unterveranstaltungId,
    },
    select: {
      id: true,
    },
  })

  const notfallKontakte = [...options.input.data.notfallkontaktPersonen]
  if (options.input.data.erziehungsberechtigtePersonen) {
    notfallKontakte.push(
      ...options.input.data.erziehungsberechtigtePersonen.map((kontakt) => ({
        ...kontakt,
        istErziehungsberechtigt: true,
      }))
    )
  }
  return prisma.person.create({
    data: {
      firstname: options.input.data.firstname,
      lastname: options.input.data.lastname,
      birthday: options.input.data.birthday,
      essgewohnheit: options.input.data.essgewohnheit,
      nahrungsmittelIntoleranzen: options.input.data.nahrungsmittelIntoleranzen,
      weitereIntoleranzen: options.input.data.weitereIntoleranzen,
      qualifikationenFahrerlaubnis: options.input.data.qualifikationenFahrerlaubnis,
      qualifikationenSchwimmer: options.input.data.qualifikationenSchwimmer,
      qualifikationenErsteHilfe: options.input.data.qualifikationenErsteHilfe,
      qualifikationenSanitaeter: options.input.data.qualifikationenSanitaeter,
      qualifikationenFunk: options.input.data.qualifikationenFunk,
      konfektionsgroesse: options.input.data.konfektionsgroesse,
      notfallkontakte: {
        create: notfallKontakte,
      },
      anmeldungen: {
        create: {
          unterveranstaltungId: unterveranstaltung.id,
          mahlzeiten: options.input.data.mahlzeitenIds
            ? {
                connect: options.input.data.mahlzeitenIds.map((id) => ({
                  id,
                })),
              }
            : undefined,
          uebernachtungsTage: options.input.data.uebernachtungsTage,
          tshirtBestellt: options.input.data.tshirtBestellt,
        },
      },
    },
    select: {
      id: true,
    },
  })
}
