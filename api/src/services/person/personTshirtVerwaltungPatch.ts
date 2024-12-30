import { Konfektionsgroesse, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProcedure } from '../../types/defineProcedure.js'

export const personTshirtVerwaltungPatchProcedure = defineProcedure({
  key: 'tshirtVerwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    anmeldungId: z.number().int(),
    bestellen: z.boolean(),
    groesse: z.nativeEnum(Konfektionsgroesse),
  }),
  async handler({ input }) {
    await prisma.anmeldung.update({
      where: {
        id: input.anmeldungId,
      },
      data: {
        tshirtBestellt: input.bestellen,
        person: {
          update: {
            konfektionsgroesse: input.groesse,
          },
        },
      },
    })
  },
})
