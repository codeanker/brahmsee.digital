import z from 'zod'

import config from '../../config'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const fileGetUrlActionProcedure = defineProcedure({
  key: 'fileGetUrl',
  method: 'query',
  protection: { type: 'public' }, // TODO: authentication
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    const file = await prisma.file.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        provider: true,
        uploaded: true,
      },
    })
    if (!file.uploaded) throw new Error('File is not uploaded')
    return new URL(`/api/download/file/${file.provider}/${file.id}`, config.clientUrl).href
  },
})
