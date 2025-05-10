import { z } from 'zod'
import client from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { veranstaltungSettingsSchema } from './veranstaltung.schema.js'

export const veranstaltungSettingsPatchProcedure = defineProtectedMutateProcedure({
  key: 'settingsPatch',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    veranstaltungId: z.number().int(),
    settings: veranstaltungSettingsSchema,
  }),
  handler: async ({ input }) => {
    await client.veranstaltung.update({
      where: {
        id: input.veranstaltungId,
      },
      data: {
        settings: input.settings,
      },
    })
  },
})
