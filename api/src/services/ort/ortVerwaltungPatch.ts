import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { addressSchema } from '../address/schema/address.schema'

export const ortVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      name: z.string(),
      address: addressSchema.optional().nullable(),
    }),
  }),
  async handler({ input }) {
    const existing = await prisma.address.findFirst({
      where: {
        city: input.data.address?.city,
        zip: input.data.address?.zip,
        street: input.data.address?.street,
        number: input.data.address?.number,
      },
    })

    return prisma.ort.update({
      data: {
        name: input.data.name,
        address: input.data.address
          ? {
              upsert: {
                create: input.data.address,
                update: input.data.address,
                where: {
                  id: existing?.id,
                },
              },
            }
          : undefined,
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
