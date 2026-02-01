import { z } from 'zod'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import prisma from '../../prisma.js'

export const anmeldungLinkAuthorizeProcedure = definePublicQueryProcedure({
  key: 'authorize',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.string().uuid(),
    accessToken: z.string().uuid(),
  }),
  handler: async ({ input: { unterveranstaltungId, accessToken } }) => {
    const result = await prisma.anmeldungLink.findFirst({
      where: {
        unterveranstaltungId,
        accessToken,
        usedAt: null,
      },
    })

    return result !== null
  },
})
