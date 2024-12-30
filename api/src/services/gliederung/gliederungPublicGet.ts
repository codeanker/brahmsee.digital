import z from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"

export const gliederungPublicGetProcedure = defineProcedure({
  key: 'publicGet',
  method: 'query',
  protection: { type: 'public' },
  inputSchema: z.strictObject({
    gliederungId: z.number().int(),
  }),
  async handler(options) {
    return prisma.gliederung.findUniqueOrThrow({
      where: {
        id: options.input.gliederungId,
      },
      select: {
        name: true,
      },
    })
  },
})
