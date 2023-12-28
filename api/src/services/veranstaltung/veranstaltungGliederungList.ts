import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const veranstaltungGliederungListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN', 'ADMIN'] },
  inputSchema: z.string().optional(),
  async handler({ ctx }) {
    const meineGliederungen = await prisma.gliederungToAccount.findMany({
      where: {
        accountId: ctx.accountId,
      },
      select: {
        gliederungId: true,
      },
    })
    const meineUnterveranstaltungen = await prisma.unterveranstaltung.findMany({
      where: {
        gliederungId: {
          in: meineGliederungen.map((g) => g.gliederungId),
        },
      },
    })

    await prisma.veranstaltung.findMany({
      where: {
        OR: [
          {
            unterveranstaltungen: {
              every: {
                id: {
                  in: meineUnterveranstaltungen.map((v) => v.id),
                },
              },
            },
          },
          {
            meldebeginn: {
              lte: new Date(),
            },
            meldeschluss: {
              gte: new Date(),
            },
          },
        ],
      },
    })
  },
})
