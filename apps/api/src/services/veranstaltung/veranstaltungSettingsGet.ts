import { z } from 'zod'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import client from '../../prisma.js'
import type { VeranstaltungSettings } from './veranstaltung.schema.js'

export const veranstaltungSettingsGetProcedure = defineProtectedQueryProcedure({
  key: 'settingsGet',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    veranstaltungId: z.number().int(),
  }),
  handler: async ({ input }) => {
    const { settings } = await client.veranstaltung.findFirstOrThrow({
      where: {
        id: input.veranstaltungId,
      },
      select: {
        settings: true,
      },
    })

    return settings as VeranstaltungSettings
  },
})
