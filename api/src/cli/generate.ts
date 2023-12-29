import path from 'path'
import { fileURLToPath } from 'url'

import { Prisma } from '@prisma/client'
import { Command } from 'commander'

import { generateService } from '../generator/generateService'
import type { GeneratorContext } from '../generator/utlils'
import { pascalToCamelCase } from '../util/casing'
import { getDirectories } from '../util/files'

import { ignoreList } from './ignoreList'
import { inquireGenerateProcedure } from './inquireGenerateProcedure'
import { inquireGenerateService } from './inquireGenerateService'

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
program.version('0.0.1')

program
  .command('service')
  .description('Generate a service')
  .option('-n, --name <serviceName>', 'Service name')
  .action(async ({ name }) => {
    if (name) {
      await generateService(name, context)
    } else {
      inquireGenerateService(missingServices, context)
    }
  })

program
  .command('procedure')
  .description('Generate a procedure')
  .option('-s, --service <serviceName>', 'Service name')
  .option('-u, --usecase <usecase>', 'Usecase')
  .option('-a, --action <actionName>', 'Action')
  .option('-p, --protection <protection>', 'Protection type: public | restrictToRoleIds=ADMIN,USER')
  .action((args) => inquireGenerateProcedure(args, context, existingServices))

program.parse(process.argv)
