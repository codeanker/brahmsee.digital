import { z } from 'zod'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import client from '../../prisma.js'

export const anmeldungLinkAuthorizeProcedure = definePublicQueryProcedure({
  key: 'authorize',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
    accessToken: z.string().uuid(),
  }),
  handler: async ({ input: { unterveranstaltungId, accessToken } }) => {
    const result = await client.anmeldungLink.findFirst({
      where: {
        unterveranstaltungId,
        accessToken,
        usedAt: null,
      },
    })

    return result !== null
  },
})
