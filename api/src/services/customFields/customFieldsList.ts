import type { CustomField } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const customFieldsList = defineProcedure({
  key: 'list',
  method: 'query',
  protection: { type: 'public' },
  inputSchema: z.strictObject({
    entity: z.enum(['veranstaltung', 'ausschreibung']),
    entityId: z.number(),
  }),
  async handler({ input }) {
    let fields: CustomField[] = []

    if (input.entity === 'veranstaltung') {
      const veranstaltung = await prisma.veranstaltung.findUniqueOrThrow({
        where: {
          id: input.entityId,
        },
        include: {
          customFields: true,
        },
      })

      fields = veranstaltung.customFields
    }

    return fields
  },
})
