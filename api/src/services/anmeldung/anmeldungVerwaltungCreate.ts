import { defineProcedure } from '../../types/defineProcedure'

import { handle, inputSchema } from './anmeldungPublicCreate'

export const anmeldungVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: inputSchema,
  async handler(options) {
    await handle(options.input, true)
  },
})
