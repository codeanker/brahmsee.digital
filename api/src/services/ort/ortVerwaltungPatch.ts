import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { isAllUndefined } from '../../util/object'
import { addressSchema } from '../address/schema/address.schema'

export const ortVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      name: z.string(),
      address: addressSchema,
    }),
  }),
  async handler({ input }) {
    const existing = await prisma.address.findFirst({
      where: {
        AND: {
          city: input.data.address.city,
          zip: input.data.address.zip,
          street: input.data.address.street,
          number: input.data.address.number,
        },
      },
    })

    return prisma.ort.update({
      data: {
        name: input.data.name,
        address: isAllUndefined(input.data.address)
          ? undefined
          : {
              upsert: {
                create: {
                  zip: input.data.address.zip!,
                  city: input.data.address.city!,
                  street: input.data.address.street!,
                  number: input.data.address.number!,
                },
                update: {
                  zip: input.data.address.zip!,
                  city: input.data.address.city!,
                  street: input.data.address.street!,
                  number: input.data.address.number!,
                },
                where: {
                  id: existing?.id,
                },
              },
            },
      },
      where: {
        id: input.id,
      },
      select: {
        name: true,
        address: true,
      },
    })
  },
})
