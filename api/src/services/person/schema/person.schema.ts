import { Essgewohnheit, Gender, NahrungsmittelIntoleranz, Prisma } from '@prisma/client'
import { z } from 'zod'

import { addressSchema, createOrUpdateAddress } from '../../address/schema/address.schema.js'
import { kontaktSchema, type TKontaktSchema } from '../../kontakt/schema/kontakt.schema.js'

export type TPersonSchema = z.infer<typeof personSchema>
export const personSchema = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  birthday: z.date(),
  gender: z.nativeEnum(Gender),
  gliederungId: z.number(),
  email: z.string(),
  telefon: z.string(),
  address: addressSchema,
  essgewohnheit: z.nativeEnum(Essgewohnheit),
  nahrungsmittelIntoleranzen: z.array(z.nativeEnum(NahrungsmittelIntoleranz)),
  weitereIntoleranzen: z.array(z.string()).optional(),
  erziehungsberechtigtePersonen: z.array(kontaktSchema).optional(),
  notfallkontaktPersonen: z.array(kontaktSchema),
  photoId: z.string().nullish(),
})

export const personSchemaOptional = personSchema.partial()

export async function getPersonCreateData(
  input: z.infer<typeof personSchemaOptional>
): Promise<Prisma.PersonCreateArgs['data']> {
  let addressId: number | undefined = undefined
  if (input.address) {
    addressId = await createOrUpdateAddress(input.address)
  }

  return {
    firstname: input.firstname!,
    lastname: input.lastname!,
    birthday: input.birthday,
    gender: input.gender,
    email: input.email!,
    telefon: input.telefon!,
    gliederungId: input.gliederungId,
    essgewohnheit: input.essgewohnheit,
    nahrungsmittelIntoleranzen: input.nahrungsmittelIntoleranzen,
    weitereIntoleranzen: input.weitereIntoleranzen,
    addressId: addressId,
    notfallkontakte: {
      create: input.notfallkontaktPersonen,
    },
    photoId: input.photoId,
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
