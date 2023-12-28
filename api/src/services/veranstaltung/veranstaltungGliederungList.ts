import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const veranstaltungGliederungListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN'] },
  inputSchema: z.string().optional(),
  async handler({ ctx }) {
    const gliederung = await getGliederungRequireAdmin(ctx.accountId)
    const meineUnterveranstaltungen = await prisma.unterveranstaltung.findMany({
      where: {
        gliederungId: gliederung.id,
      },
    })

    const data = await prisma.veranstaltung.findMany({
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

    return await Promise.all(
      data.map(async (v) => {
        const unterveranstaltung = await prisma.unterveranstaltung.findFirst({
          where: {
            veranstaltungId: v.id,
          },
        })
        return {
          data: v,
          hasUnterveranstaltung: unterveranstaltung !== null,
        }
      })
    )
  },
})
