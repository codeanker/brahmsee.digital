import { z } from 'zod'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import prisma from '../../prisma.js'

export const requestGliederungAccessValidateProcedure = definePublicQueryProcedure({
  key: 'requestGliederungAccessValidate',
  inputSchema: z.strictObject({
    token: z.string().uuid(),
  }),
  handler: async ({ input }) => {
    const gta = await prisma.gliederungToAccount.findFirst({
      where: {
        confirmByGliederungToken: input.token,
      },
      select: {
        id: true,
        account: {
          select: {
            email: true,
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        gliederung: {
          select: {
            name: true,
          },
        },
      },
    })

    return gta || false
  },
})
