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

  let procedureFunction = 'defineProcedure'
  let protectionContent = getProtectionContent(procedure.protection)
  let roleIds = ''

  if (procedure.protection.type === 'restrictToRoleIds') {
    procedureFunction = 'defineProtectedProcedure'
    roleIds = `roleIds: ${JSON.stringify(procedure.protection.roleIds)},`
    protectionContent = ''
  } else if (procedure.protection.type === 'public') {
    procedureFunction = 'definePublicProcedure'
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
  await writeFile(procedurePath, content)
  await addProcedureToRouter(procedure, sericeDir, procedureType)
}
