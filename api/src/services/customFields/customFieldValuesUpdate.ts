import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const customFieldValuesUpdate = defineProtectedMutateProcedure({
  key: 'valuesUpdate',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    data: z.array(
      z.strictObject({
        id: z.number().int(),
        value: z.union([z.string(), z.boolean(), z.undefined()]),
      })
    ),
    anmeldungId: z.number().int(),
  }),
  async handler(options) {
    type AnmeldungWhereUniqueInput = Parameters<typeof prisma.anmeldung.update>[0]['where']
    const where: AnmeldungWhereUniqueInput = { id: options.input.anmeldungId }

    if (options.ctx.account.role !== Role.ADMIN) {
      const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
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
      options.input.data.map(async (element) => {
        const existingValues = (
          await prisma.customFieldValue.findMany({
            where: {
              fieldId: element.id,
              anmeldungId: options.input.anmeldungId,
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
            causerId: options.ctx.accountId,
            metadata: {
              oldValue: existingValues.value,
              value: element.value,
              fieldId: element.id,
              anmeldungId: options.input.anmeldungId,
            },
          })
        } else {
          const res = await prisma.customFieldValue.create({
            data: {
              value: element.value,
              fieldId: element.id,
              anmeldungId: options.input.anmeldungId,
            },
          })
          await logActivity({
            type: 'CREATE',
            description: 'Benutzerdefinierten Wert hinzugefügt',
            subjectType: 'customFieldValues',
            subjectId: res.id,
            causerId: options.ctx.accountId,
            metadata: {
              value: element.value,
              fieldId: element.id,
              anmeldungId: options.input.anmeldungId,
            },
          })
        }
      })
    )

    return res
  },
})
