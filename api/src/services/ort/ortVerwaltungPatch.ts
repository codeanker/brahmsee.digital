import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { addressSchema, createOrUpdateAddress } from '../address/schema/address.schema'

export const ortVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      name: z.string(),
      address: addressSchema,
    }),
  }),
  async handler({ input }) {
    const addressId = await createOrUpdateAddress(input.data.address)

    return prisma.ort.update({
      data: {
        name: input.data.name,
        addressId,
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
