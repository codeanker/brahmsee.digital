import { z } from 'zod'

import { CustomFieldPosition, CustomFieldType, Prisma } from '@prisma/client'
import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import {
  calculatePagination,
  defineEmptyQueryResponse,
  defineQueryResponse,
  defineTableInput,
} from '../../types/defineTableProcedure.js'
import { boolish } from '../../util/zod.js'

const baseFilter = z.strictObject({
  entity: z.enum(['veranstaltung', 'unterveranstaltung']),
  entityId: z.string().uuid(),
  position: z.nativeEnum(CustomFieldPosition).optional(),
})

export const customFieldsTable = definePublicQueryProcedure({
  key: 'list',
  inputSchema: baseFilter,
  async handler({ input: { entity, entityId, position } }) {
    if (entity === 'veranstaltung') {
      return await prisma.customField.findMany({
        where: {
          veranstaltungId: entityId,
          positions:
            position === undefined
              ? undefined
              : {
                  has: position,
                },
        },
      })
    } else if (entity === 'unterveranstaltung') {
      return await prisma.customField.findMany({
        where: {
          positions:
            position === undefined
              ? undefined
              : {
                  has: position,
                },
          OR: [
            {
              unterveranstaltungId: entityId,
            },
            {
              veranstaltung: {
                unterveranstaltungen: {
                  some: {
                    id: entityId,
                  },
                },
              },
            },
          ],
        },
      })
    }

    return []
  },
})

export const customFieldsList = definePublicQueryProcedure({
  key: 'table',
  inputSchema: baseFilter.extend({
    table: defineTableInput({
      filter: {
        name: z.string(),
        type: z.nativeEnum(CustomFieldType),
        required: boolish,
        position: z.nativeEnum(CustomFieldPosition),
      },
      orderBy: ['name'],
    }),
  }),
  async handler({ input }) {
    const where: Prisma.CustomFieldWhereInput = {
      name: {
        contains: input.table?.filter?.name,
        mode: 'insensitive',
      },
      type: input.table?.filter?.type,
      required: input.table?.filter?.required,
      positions:
        input.table?.filter?.position === undefined
          ? undefined
          : {
              hasSome: [input.table.filter.position],
            },
    }

    const total = await prisma.customField.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, input.table?.pagination)

    if (input.entity === 'veranstaltung') {
      const customFields = await prisma.customField.findMany({
        take: pageSize,
        skip: pageSize * pageIndex,
        where: {
          ...where,
          veranstaltungId: input.entityId,
        },
        orderBy: input.table?.orderBy,
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
