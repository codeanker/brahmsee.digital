import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const customFieldValuesUpdate = defineProtectedMutateProcedure({
  key: 'valuesUpdate',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.strictObject({
    data: z.array(
      z.strictObject({
        id: z.number().int(),
        value: z.union([z.string(), z.boolean(), z.undefined()]),
      })
    ),
    anmeldungId: z.number().int(),
  }),
  async handler({ ctx: { account, accountId }, input }) {
    type AnmeldungWhereUniqueInput = Parameters<typeof prisma.anmeldung.update>[0]['where']
    const where: AnmeldungWhereUniqueInput = { id: input.anmeldungId }

    if (account.role === Role.USER) {
      where.accountId = accountId
    } else if (account.role === Role.GLIEDERUNG_ADMIN) {
      const gliederung = await getGliederungRequireAdmin(accountId)
      where.unterveranstaltung = {
        gliederungId: gliederung.id,
      }
    }

    const anmeldung = await prisma.anmeldung.findUnique({
      where,
      select: {
        id: true,
        unterveranstaltung: {
          select: {
            veranstaltung: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!anmeldung) {
      return 'Keine Anmeldung gefunden'
    }

    const res = await Promise.all(
      input.data.map(async (element) => {
        const existingValues = (
          await prisma.customFieldValue.findMany({
            where: {
              fieldId: element.id,
              anmeldungId: input.anmeldungId,
            },
            select: {
              id: true,
              value: true,
            },
          })
        )[0]

        if (existingValues !== undefined) {
          await prisma.customFieldValue.update({
            where: {
              id: existingValues.id,
            },
            data: {
              value: element.value,
            },
          })
          await logActivity({
            type: 'UPDATE',
            description: 'Benutzerdefinierten Wert aktualisiert',
            subjectType: 'customFieldValues',
            subjectId: existingValues.id,
            causerId: accountId,
            metadata: {
              oldValue: existingValues.value,
              value: element.value,
              fieldId: element.id,
              anmeldungId: input.anmeldungId,
            },
          })
        } else {
          const res = await prisma.customFieldValue.create({
            data: {
              value: element.value,
              fieldId: element.id,
              anmeldungId: input.anmeldungId,
            },
          })
          await logActivity({
            type: 'CREATE',
            description: 'Benutzerdefinierten Wert hinzugefügt',
            subjectType: 'customFieldValues',
            subjectId: res.id,
            causerId: accountId,
            metadata: {
              value: element.value,
              fieldId: element.id,
              anmeldungId: input.anmeldungId,
            },
          })
        }
      })
    )

    return res
  },
})
