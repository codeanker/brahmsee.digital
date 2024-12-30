import { Role } from '@prisma/client'

import { defineProcedure } from "../../types/defineProcedure.js"

import { handle, inputSchema } from "./anmeldungPublicCreate.js"

export const anmeldungVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: inputSchema,
  async handler(options) {
    await handle(options.input, false)
  },
})
