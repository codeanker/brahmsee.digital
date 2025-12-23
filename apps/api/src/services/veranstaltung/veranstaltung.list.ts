import { Prisma, Role } from '@prisma/client'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const veranstaltungSelect: Prisma.VeranstaltungSelect = {
  id: true,
  name: true,
  beginn: true,
  ende: true,
  ort: {
    select: {
      name: true,
      id: true,
    },
  },
  meldebeginn: true,
  meldeschluss: true,
  maxTeilnehmende: true,
  teilnahmegebuehr: true,
  hostname: {
    select: {
      id: true,
      hostname: true,
    },
  },
}

export const unterveranstaltungSelect: Prisma.UnterveranstaltungSelect = {
  id: true,
  maxTeilnehmende: true,
  teilnahmegebuehr: true,
  meldebeginn: true,
  meldeschluss: true,
  gliederungId: true,
  _count: {
    select: {
      Anmeldung: {
        where: {
          status: {
            equals: 'BESTAETIGT',
          },
        },
      },
    },
  },
}

export const veranstaltungListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.void(),
  async handler({ ctx }) {
    const gliederung =
      ctx.account.role === Role.GLIEDERUNG_ADMIN ? await getGliederungRequireAdmin(ctx.accountId) : undefined

    const data = await prisma.veranstaltung.findMany({
      select: {
        ...veranstaltungSelect,
        unterveranstaltungen: {
          where: {
            gliederungId: gliederung?.id,
          },
          select: unterveranstaltungSelect,
        },
      },
    })

    const mapped = data.map((v) => {
      return {
        ...v,
        anzahlAnmeldungen: v.unterveranstaltungen.reduce((a, b) => a + b._count.Anmeldung, 0),
      }
    })

    return mapped
  },
})
