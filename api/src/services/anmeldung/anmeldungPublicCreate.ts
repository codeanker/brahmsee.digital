import { z } from 'zod'

import prisma from '../../prisma'
import { getNotfallkontakte } from '../person/helpers/getNotfallkontakte'
import { personInput } from '../person/helpers/personInput'

export const ZAnmeldungPublicCreateInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
    ...personInput,
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
      address: {
        create: options.input.data.addresse,
      },
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
