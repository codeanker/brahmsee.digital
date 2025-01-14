import { z } from 'zod'
import client from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import { populateDefaultSettings } from './settings.schema.js'

export const settingsGetProcedure = definePublicQueryProcedure({
  key: 'settingsProtectedGet',
  inputSchema: z.strictObject({
    veranstaltungId: z.number().int(),
  }),
  handler: async ({ input }) => {
    const { settings } = await client.veranstaltung.findUniqueOrThrow({
      where: {
        id: input.veranstaltungId,
      },
      select: {
        settings: true,
      },
    })

    if (settings === undefined) {
      return await populateDefaultSettings(input.veranstaltungId)
    }

    return settings
  },
})
