/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import inquirer from 'inquirer'

import { generateProcedureAction } from './generator/generateProcedureAction.js'
import { generateProcedureCreate } from './generator/generateProcedureCreate.js'
import { generateProcedureDelete } from './generator/generateProcedureDelete.js'
import { generateProcedureGet } from './generator/generateProcedureGet.js'
import { generateProcedureList } from './generator/generateProcedureList.js'
import { generateProcedurePatch } from './generator/generateProcedurePatch.js'
import type { GenerateProcedureType, GeneratorContext } from './generator/utlils.js'
import { inquireProtection } from './inquireProtection.js'

export type ProcedureArgs = { service?: string; usecase?: string; action?: GenerateProcedureType; protection?: string }
export async function inquireGenerateProcedure(args: ProcedureArgs, context: GeneratorContext, services: string[]) {
  let service
  if (args.service !== undefined) {
    service = args.service
  } else {
    const serviceAnswer = (await inquirer.prompt([
      {
        type: 'list',
        name: 'service',
        message: 'What is the service of the procedure?',
        choices: services,
      },
    ])) as { service: string }
    service = serviceAnswer.service
  }
  let usecase
  if (args.usecase !== undefined) {
    usecase = args.usecase
  } else {
    const usecaseAnswer = (await inquirer.prompt([
      {
        type: 'input',
        name: 'usecase',
        message: 'What is the usecase of the procedure?',
      },
    ])) as { usecase: string }
    usecase = usecaseAnswer.usecase
  }

  let action: GenerateProcedureType[]
  if (args.action !== undefined) {
    action = [args.action]
  } else {
    const actionAnswer = (await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'action',
        message: 'Which action do you want to use?',
        choices: [
          'get - get a single entity',
          'list - get a list and count of entities',
          'create - create a new entity',
          'patch - update an entity',
          'delete - delete an entity',
          'action - custom action',
        ],
      },
    ])) as { action: string[] }
    action = actionAnswer.action.map((a) => a.split(' ')[0]) as GenerateProcedureType[]
  }

  let protection
  if (args.protection !== undefined) {
    if (args.protection === 'public') {
      protection = {
        type: 'public',
      }
    } else if (args.protection.startsWith('restrictToRoleIds')) {
      const roles = args.protection.split('=')
      const commaSeperatedRoles = roles[1] as string
      const roleIds = commaSeperatedRoles.split(',')
      protection = {
        type: 'restrictToRoleIds',
        roleIds,
      }
    }
  } else {
    protection = await inquireProtection()
  }
  for (const actionItem of action) {
    switch (actionItem) {
      case 'get':
        await generateProcedureGet({ service, usecase, protection }, context)
        break
      case 'list':
        await generateProcedureList({ service, usecase, protection }, context)
        break
      case 'create':
        await generateProcedureCreate({ service, usecase, protection }, context)
        break
      case 'patch':
        await generateProcedurePatch({ service, usecase, protection }, context)
        break
      case 'delete':
        await generateProcedureDelete({ service, usecase, protection }, context)
        break
      case 'action':
        await generateProcedureAction({ service, usecase, protection }, context)
        break
    }
  }
}
