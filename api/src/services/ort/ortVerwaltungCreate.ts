import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProcedure } from '../../types/defineProcedure.js'
import { addressSchema, createOrUpdateAddress } from '../address/schema/address.schema.js'

export const ortVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
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
