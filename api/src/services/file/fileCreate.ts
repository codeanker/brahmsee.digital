import { randomUUID } from 'crypto'

import z from 'zod'

import config from '../../config'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const fileCreateProcedure = defineProcedure({
  key: 'fileCreate',
  method: 'mutation',
  protection: { type: 'public' }, // TODO: authentication
  inputSchema: z.undefined(),
  async handler() {
    return prisma.file.create({
      data: {
        provider: config.fileProvider,
        key: randomUUID(),
      },
      select: {
        id: true,
        provider: true,
        uploaded: true,
      },
    })
  },
})
