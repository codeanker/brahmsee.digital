import z from 'zod'

import prisma from '../../prisma'

export const ZAnmeldungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
    firstname: z.string(),
    lastname: z.string(),
    birthday: z.string().datetime(),
  }),
})

export type TAnmeldungCreateInputSchema = z.infer<typeof ZAnmeldungCreateInputSchema>

type AnmeldungCreateOptions = {
  input: TAnmeldungCreateInputSchema
}

export async function anmeldungCreate(options: AnmeldungCreateOptions) {
  const unterveranstaltung = await prisma.unterveranstaltung.findFirstOrThrow({
    where: {
      id: options.input.data.unterveranstaltungId,
    },
    select: {
      id: true,
    },
  })
  return prisma.person.create({
    data: {
      firstname: options.input.data.firstname,
      lastname: options.input.data.lastname,
      birthday: options.input.data.birthday,
      anmeldungen: {
        create: {
          unterveranstaltungId: unterveranstaltung.id,
        },
      },
    },
    select: {
      id: true,
    },
  })
}
