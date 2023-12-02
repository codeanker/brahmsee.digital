import { writeFile } from 'fs/promises'
import path from 'path'

import { toPascalCase } from '../helpers/casing'
import { checkFileExists } from '../helpers/files'

import {
  type ProcedureOptions,
  getProcedureFileName,
  addProcedureToRouter,
  getProtectionContent,
  type GeneratorContext,
} from './utlils'

export async function generateProcedureCreate(procedure: ProcedureOptions, context: GeneratorContext) {
  const procedureType = 'create'
  const procedureMethod = 'mutation'

  const sericeDir = path.join(context.servicesDir, procedure.service)
  const procedureFileName = getProcedureFileName(procedure, procedureType)
  const procedureAction = `${procedure.usecase}${toPascalCase(procedureType)}`
  const procedurePath = path.join(sericeDir, `${procedureFileName}.ts`)

  const alreadyExists = await checkFileExists(procedurePath)
  if (alreadyExists) {
    throw new Error(`Procedure ${procedureFileName} already exists`)
  }

  const content = `import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const ${procedureFileName}Procedure = defineProcedure({
  key: '${procedureAction}',
  method: '${procedureMethod}',
  protection: ${getProtectionContent(procedure.protection)},
  inputSchema: z.strictObject({
    data: z.strictObject({}),
  }),
  async handler(options) {
    return prisma.${procedure.service}.create({
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
