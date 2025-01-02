import { Role } from '@prisma/client'

import { defineProtectedProcedure } from '../../types/defineProcedure.js'
import { handle, inputSchema } from './anmeldungPublicCreate.js'

export const anmeldungVerwaltungCreateProcedure = defineProtectedProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  inputSchema: inputSchema,
  async handler(options) {
    await handle(options.input, false)
  },
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
})
