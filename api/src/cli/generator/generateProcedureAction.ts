import { writeFile } from 'fs/promises'
import path from 'path'

import { toPascalCase } from '../../util/casing.js'
import { checkFileExists } from '../../util/files.js'

import {
  type ProcedureOptions,
  getProcedureFileName,
  addProcedureToRouter,
  getProtectionContent,
  type GeneratorContext,
} from './utlils.js'

export async function generateProcedureAction(procedure: ProcedureOptions, context: GeneratorContext) {
  const sericeDir = path.join(context.servicesDir, procedure.service)
  const procedureType = 'action'
  const procedureFileName = getProcedureFileName(procedure, procedureType)
  const procedureAction = `${procedure.usecase}${toPascalCase(procedureType)}`
  const procedureMethod = 'mutation'
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
  inputSchema: z.undefined(),
  async handler(options) {},
})
`
  await writeFile(procedurePath, content)
  await addProcedureToRouter(procedure, sericeDir, procedureType)
}
