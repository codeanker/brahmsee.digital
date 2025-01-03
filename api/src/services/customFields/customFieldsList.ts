import { z } from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const customFieldsList = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    entity: z.enum(['veranstaltung', 'unterveranstaltung']).optional(),
    entityId: z.number(),
  }),
  async handler({ input }) {
    if (input.entity === 'veranstaltung') {
      const veranstaltung = await prisma.veranstaltung.findUniqueOrThrow({
        where: {
          id: input.entityId,
        },
        include: {
          customFields: true,
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
              customFields: true,
            },
          },
        },
      })

      return [...ausschreibung.veranstaltung.customFields, ...ausschreibung.customFields]
    }

    return []
  },
})
