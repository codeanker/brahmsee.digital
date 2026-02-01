import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { addressSchema, createOrUpdateAddress } from '../address/schema/address.schema.js'

export const ortVerwaltungPatchProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungPatch',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.string().uuid(),
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
