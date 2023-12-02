import { writeFile } from 'fs/promises'
import path from 'path'

import {
  type ProcedureOptions,
  getProcedureFileName,
  toPascalCase,
  addListProcedureToRouter,
  getProtectionContent,
} from './utlils'

import type { GeneratorContext } from './index'

export async function generateProcedureList(procedure: ProcedureOptions, context: GeneratorContext) {
  const sericeDir = path.join(context.servicesDir, procedure.service)
  const procedureType = 'list'
  const procedureFileName = getProcedureFileName(procedure, procedureType)
  const procedureAction = `${procedure.usecase}${toPascalCase(procedureType)}`
  const procedurePath = path.join(sericeDir, `${procedureFileName}.ts`)

  const content = `import type { Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

const inputSchema = defineQuery({
  filter: z.strictObject({}),
})

function getFilterWhere(filter: z.infer<typeof inputSchema>['filter']): Prisma.${toPascalCase(
    procedure.service
  )}WhereInput {
  return filter
}

export const ${procedureFileName}Procedure = defineProcedure({
  key: '${procedureAction}',
  method: 'query',
  protection: ${getProtectionContent(procedure.protection)},
  inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination

    return await prisma.${procedure.service}.findMany({
      skip,
      take,
      where: getFilterWhere(options.input.filter),
      select: {
        id: true,
      },
    })
  },
})

export const ${procedureFileName}CountProcedure = defineProcedure({
  key: '${procedureAction}Count',
  method: 'query',
  protection: ${getProtectionContent(procedure.protection)},
  inputSchema,
  async handler(options) {
    return await prisma.${procedure.service}.count({
      where: getFilterWhere(options.input.filter),
    })
  },
})
`
  writeFile(procedurePath, content)

  await addListProcedureToRouter(procedure, sericeDir, procedureType)
}
