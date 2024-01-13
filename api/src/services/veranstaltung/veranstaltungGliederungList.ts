import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

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

    const mapped = await Promise.all(
      data.map(async (veranstaltung) => {
        const unterveranstaltung = await prisma.unterveranstaltung.findFirst({
          where: {
            veranstaltungId: veranstaltung.id,
          },
        })
        return {
          ...veranstaltung,
          hasUnterveranstaltung: unterveranstaltung !== null,
        }
      })
    )

    return mapped
  },
})
