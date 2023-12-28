import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { isAllUndefined } from '../../util/object'
import { addressSchema, findAddress } from '../address/schema/address.schema'

export const ortVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      name: z.string(),
      address: addressSchema,
    }),
  }),
  async handler({ input }) {
    const existingAddress = await findAddress(input.data.address)

    return prisma.ort.create({
      data: {
        name: input.data.name,
        address: isAllUndefined(input.data.address)
          ? undefined
          : {
              connectOrCreate: {
                create: {
                  zip: input.data.address.zip!,
                  city: input.data.address.city!,
                  street: input.data.address.street!,
                  number: input.data.address.number!,
                },
                where: {
                  id: existingAddress?.id,
                },
              },
            },
      },
      select: {
        id: true,
      },
    })
  },
})
