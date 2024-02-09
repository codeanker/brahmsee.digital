import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

export const unterveranstaltungGliederungCreateProcedure = defineProcedure({
  key: 'gliederungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN', 'ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      veranstaltungId: z.number().int(),
      maxTeilnehmende: z.number().int(),
      teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
      meldebeginn: z.date(),
      meldeschluss: z.date(),
      beschreibung: z.string().optional(),
    }),
  }),
  async handler(options) {
    // check logged in user is admin of gliederung
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
    const veranstaltung = await prisma.veranstaltung.findUniqueOrThrow({
      where: {
        id: options.input.data.veranstaltungId,
      },
      select: {
        meldebeginn: true,
        meldeschluss: true,
      },
    })
    // check meldebegin is after parent meldebeginn
    if (new Date(options.input.data.meldebeginn) < veranstaltung.meldebeginn) {
      throw new TRPCError({
        message: 'meldebeginn',
        code: 'BAD_REQUEST',
      })
    }
    // check meldeschluss is before parent meldeschluss
    if (new Date(options.input.data.meldeschluss) > veranstaltung.meldeschluss) {
      throw new TRPCError({
        message: 'meldeschluss',
        code: 'BAD_REQUEST',
      })
    }
    return prisma.unterveranstaltung.create({
      data: {
        ...options.input.data,
        type: 'GLIEDERUNG',
        gliederungId: gliederung.id,
      },
      select: {
        id: true,
      },
    })
  },
})
