import { writeFile } from 'fs/promises'
import path from 'path'

import {
  type ProcedureOptions,
  getProcedureFileName,
  addProcedureToRouter,
  getProtectionContent,
  toPascalCase,
} from './utlils'

import type { GeneratorContext } from './index'

export async function generateProcedurePatch(procedure: ProcedureOptions, context: GeneratorContext) {
  const procedureType = 'patch'
  const procedureMethod = 'mutation'

  const sericeDir = path.join(context.servicesDir, procedure.service)
  const procedureFileName = getProcedureFileName(procedure, procedureType)
  const procedureAction = `${procedure.usecase}${toPascalCase(procedureType)}`
  const procedurePath = path.join(sericeDir, `${procedureFileName}.ts`)

  const content = `import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const ${procedureFileName}Procedure = defineProcedure({
  key: '${procedureAction}',
  method: '${procedureMethod}',
  protection: ${getProtectionContent(procedure.protection)},
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({}),
  }),
  async handler(options) {
    return prisma.${procedure.service}.update({
      where: {
        id: options.input.id,
      },
      data: options.input.data,
      select: {
        id: true,
      },
    })
  },
})
`
  writeFile(procedurePath, content)

  await addProcedureToRouter(procedure, sericeDir, procedureType)
}
