import { Konfektionsgroesse, Role } from '@prisma/client'
import z from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"

export const personTshirtGliederungPatchProcedure = defineProcedure({
  key: 'tshirtGliederungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.GLIEDERUNG_ADMIN] },
  inputSchema: z.strictObject({
    anmeldungId: z.number().int(),
    bestellen: z.boolean(),
    groesse: z.nativeEnum(Konfektionsgroesse),
  }),
  async handler({ input }) {
    // TODO: Check if allowed
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
