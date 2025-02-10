import path from 'path'
import { fileURLToPath } from 'url'

import { Prisma } from '@prisma/client'
import { Command } from 'commander'

import pkg from '../../../../package.json' assert { type: 'json' }
import { pascalToCamelCase } from '../util/casing.js'
import { getDirectories } from '../util/files.js'

import { generateService } from './generator/generateService.js'
import type { GeneratorContext } from './generator/utlils.js'
import { ignoreList } from './ignoreList.js'
import { inquireGenerateProcedure, type ProcedureArgs } from './inquireGenerateProcedure.js'
import { inquireGenerateService } from './inquireGenerateService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const servicesDir = path.join(__dirname, '../services')

export const context: GeneratorContext = {
  servicesDir,
}

export const prismaServices = Object.values(Prisma.ModelName).map(pascalToCamelCase)

const existingServices = await getDirectories(servicesDir)

const missingServices = prismaServices
  .filter((service) => !existingServices.includes(service))
  .filter((service) => !ignoreList.includes(service))

const program = new Command()
program.version(pkg.version)

program
  .command('service')
  .description('Generate a service')
  .option('-n, --name <serviceName>', 'Service name')
  .action(async ({ name }: { name: string }) => {
    if (name) {
      await generateService(name, context)
    } else {
      await inquireGenerateService(missingServices, context)
    }
  })

program
  .command('procedure')
  .description('Generate a procedure')
  .option('-s, --service <serviceName>', 'Service name')
  .option('-u, --usecase <usecase>', 'Usecase')
  .option('-a, --action <actionName>', 'Action')
  .option('-p, --protection <protection>', 'Protection type: public | restrictToRoleIds=ADMIN,USER')
  .action((args: ProcedureArgs) => inquireGenerateProcedure(args, context, existingServices))

program.parse(process.argv)
