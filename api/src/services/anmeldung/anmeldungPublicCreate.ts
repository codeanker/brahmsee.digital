import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { personSchema, getPersonCreateData } from '../person/schema/person.schema'

export const anmeldungPublicCreateProcedure = defineProcedure({
  key: 'publicCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: personSchema.extend({
      unterveranstaltungId: z.number().int(),
      mahlzeitenIds: z.array(z.number().int()).optional(),
      uebernachtungsTage: z.array(z.date()).optional(),
      tshirtBestellt: z.boolean().optional(),
      email: z.string().email(),
    }),
  }),
  async handler(options) {
    const unterveranstaltung = await prisma.unterveranstaltung.findUniqueOrThrow({
      where: {
        id: options.input.data.unterveranstaltungId,
      },
      select: {
        id: true,
      },
    })

    const personData = await getPersonCreateData(options.input.data)

    return prisma.person.create({
      data: {
        ...personData,
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
            email: options.input.data.email,
          },
        },
      },
      select: {
        id: true,
      },
    })
  },
})
