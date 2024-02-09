import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { addressSchema, createOrUpdateAddress } from '../address/schema/address.schema'

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
    const addressId = await createOrUpdateAddress(input.data.address)

    return prisma.ort.create({
      data: {
        name: input.data.name,
        addressId: addressId,
      },
      select: {
        id: true,
      },
    })
  },
})
