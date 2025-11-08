import { z } from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import { CustomFieldPosition, CustomFieldType, Prisma } from '@prisma/client'
import {
  calculatePagination,
  defineEmptyQueryResponse,
  defineQueryResponse,
  defineTableInput,
} from '../../types/defineTableProcedure.js'
import { boolish } from '../../util/zod.js'

export const customFieldsList = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    entity: z.enum(['veranstaltung', 'unterveranstaltung']),
    entityId: z.number(),
    table: defineTableInput({
      filter: {
        name: z.string(),
        type: z.nativeEnum(CustomFieldType),
        required: boolish,
        position: z.nativeEnum(CustomFieldPosition),
      },
    }),
  }),
  async handler({ input }) {
    const where: Prisma.CustomFieldWhereInput = {
      name: {
        contains: input.table.filter?.name,
        mode: 'insensitive',
      },
      type: input.table.filter?.type,
      required: input.table.filter?.required,
      positions:
        input.table.filter?.position === undefined
          ? undefined
          : {
              hasSome: [input.table.filter.position],
            },
    }

    const total = await prisma.customField.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, input.table.pagination)

    if (input.entity === 'veranstaltung') {
      const customFields = await prisma.customField.findMany({
        take: pageSize,
        skip: pageSize * pageIndex,
        where: {
          ...where,
          veranstaltungId: input.entityId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          positions: true,
          required: true,
          veranstaltungId: true,
          unterveranstaltungId: true,
        },
      })

      return defineQueryResponse({ data: customFields, total, pagination: { pageIndex, pageSize, pages } })
    } else if (input.entity === 'unterveranstaltung') {
      const customFields = await prisma.customField.findMany({
        take: pageSize,
        skip: pageSize * pageIndex,
        where: {
          ...where,
          OR: [
            {
              unterveranstaltungId: input.entityId,
            },
            {
              veranstaltung: {
                unterveranstaltungen: {
                  some: {
                    id: input.entityId,
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          positions: true,
          required: true,
          veranstaltungId: true,
          unterveranstaltungId: true,
        },
      })

      return defineQueryResponse({ data: customFields, total, pagination: { pageIndex, pageSize, pages } })
    }

    return defineEmptyQueryResponse()
  },
})
