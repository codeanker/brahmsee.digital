import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

export const unterveranstaltungGliederungPatchProcedure = defineProcedure({
  key: 'gliederungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      maxTeilnehmende: z.number().int().optional(),
      teilnahmegebuehr: z.number({ description: 'In Cent' }).int().optional(),
      meldebeginn: z.date().optional(),
      meldeschluss: z.date().optional(),
      beschreibung: z.string().optional(),
      bedingungen: z.string().optional(),
    }),
  }),
  async handler(options) {
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
    return prisma.unterveranstaltung.update({
      where: {
        id: options.input.id,
        gliederungId: gliederung.id,
      },
      data: options.input.data,
      select: {
        id: true,
      },
    })
  },
})
