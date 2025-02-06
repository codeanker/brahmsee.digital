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

export async function generateProcedureDelete(procedure: ProcedureOptions, context: GeneratorContext) {
  const sericeDir = path.join(context.servicesDir, procedure.service)
  const procedureType = 'delete'
  const procedureFileName = getProcedureFileName(procedure, procedureType)
  const procedureAction = `${procedure.usecase}${toPascalCase(procedureType)}`
  const procedureMethod = 'mutation'
  const procedurePath = path.join(sericeDir, `${procedureFileName}.ts`)

  const alreadyExists = await checkFileExists(procedurePath)
  if (alreadyExists) {
    throw new Error(`Procedure ${procedureFileName} already exists`)
  }

  let procedureFunction = 'defineProcedure'
  let protectionContent = getProtectionContent(procedure.protection)
  let roleIds = ''

  if (procedure.protection.type === 'restrictToRoleIds') {
    procedureFunction = 'defineProtectedQueryProcedure'
    roleIds = `roleIds: ${JSON.stringify(procedure.protection.roleIds)},`
    protectionContent = ''
  } else if (procedure.protection.type === 'public') {
    procedureFunction = 'definePublicQueryProcedure'
    protectionContent = ''
  }

  const content = `import z from 'zod'

import prisma from '../../prisma'
import { ${procedureFunction} } from '../../types/defineProcedure'

export const ${procedureFileName}Procedure = ${procedureFunction}({
  key: '${procedureAction}',
  method: '${procedureMethod}',
  ${roleIds}
  protection: ${protectionContent},
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return prisma.${procedure.service}.delete({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
      },
    })
  },
})
`
  await writeFile(procedurePath, content)
  await addProcedureToRouter(procedure, sericeDir, procedureType)
}
