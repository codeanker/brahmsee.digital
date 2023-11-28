import { z } from 'zod'

import prisma from '../../prisma'
import { personDto, getPersonCreateData } from '../person/dto/person.dto'

export const ZAnmeldungPublicCreateInputSchema = z.strictObject({
  data: personDto.extend({
    unterveranstaltungId: z.number().int(),
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
  const unterveranstaltung = await prisma.unterveranstaltung.findUniqueOrThrow({
    where: {
      id: options.input.data.unterveranstaltungId,
    },
    select: {
      id: true,
    },
  })

  return prisma.person.create({
    data: {
      ...getPersonCreateData(options.input.data),
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
