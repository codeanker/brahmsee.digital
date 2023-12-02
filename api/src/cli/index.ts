import path from 'path'
import { fileURLToPath } from 'url'

import { Prisma } from '@prisma/client'

import ignoreList from '../generator/ignoreList.json'
import type { GeneratorContext } from '../generator/utlils'
import { pascalToCamelCase } from '../helpers/casing'
import { getDirectories } from '../helpers/files'
// import commander from 'commander'
// import inquirer from 'inquirer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const servicesDir = path.join(__dirname, '../services')

const context: GeneratorContext = {
  servicesDir,
}

// await generateService('test2', context)
// await generateProcedureGet({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
// await generateProcedureList({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
// await generateProcedureCreate({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
// await generateProcedurePatch({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
// await generateProcedureDelete({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
// await generateProcedureAction({ service: 'test2', usecase: 'testen', protection: 'public' }, context)

const prismaServices = Object.values(Prisma.ModelName).map(pascalToCamelCase)

const existingServices = await getDirectories(servicesDir)

const missingServices = prismaServices
  .filter((service) => !existingServices.includes(service))
  .filter((service) => !ignoreList.includes(service))

console.log(missingServices)
