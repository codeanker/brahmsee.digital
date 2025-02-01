import { z } from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import { CustomFieldPosition, Prisma } from '@prisma/client'

export const customFieldsList = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    entity: z.enum(['veranstaltung', 'unterveranstaltung']),
    entityId: z.number(),
    position: z.nativeEnum(CustomFieldPosition).optional(),
  }),
  async handler({ input }) {
    const customFieldsFilter: Prisma.CustomFieldWhereInput = {}
    if (input.position !== undefined) {
      customFieldsFilter.positions = {
        hasSome: [input.position]
      }
    }

    if (input.entity === 'veranstaltung') {
      const veranstaltung = await prisma.veranstaltung.findUniqueOrThrow({
        where: {
          id: input.entityId,
        },
        include: {
          customFields: {
            where: customFieldsFilter,
          },
        },
      })

      return veranstaltung.customFields
    } else if (input.entity === 'unterveranstaltung') {
      const ausschreibung = await prisma.unterveranstaltung.findUniqueOrThrow({
        where: {
          id: input.entityId,
        },
        include: {
          customFields: true,
          veranstaltung: {
            include: {
              customFields: {
                where: customFieldsFilter,
              },
            },
          },
        },
      })

      return [...ausschreibung.veranstaltung.customFields, ...ausschreibung.customFields]
    }

    return []
  },
})
