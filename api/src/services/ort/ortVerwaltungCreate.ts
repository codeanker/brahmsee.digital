import z from 'zod'

import { defineProcedure } from '../../helpers/defineProcedure'
import prisma from '../../prisma'
import { addressSchema } from '../address/schema/address.schema'

export const ortVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      name: z.string(),
      address: addressSchema.optional(),
    }),
  }),
  async handler(options) {
    return prisma.ort.create({
      data: {
        name: options.input.data.name,
        address: options.input.data.address
          ? {
              create: options.input.data.address,
            }
          : undefined,
      },
      select: {
        id: true,
      },
    })
  },
})
