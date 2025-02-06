import { Role } from '@prisma/client'

import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { handle, inputSchema } from './anmeldungPublicCreate.js'

export const anmeldungVerwaltungCreateProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungCreate',
  inputSchema: inputSchema,
  async handler({ ctx, input }) {
    await handle({ ctx, input, isPublic: false })
  },
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
})
