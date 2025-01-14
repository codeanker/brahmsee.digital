/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Role } from '@prisma/client'
import inquirer from 'inquirer'

export async function inquireProtection() {
  let protection
  const protectionTypeAnswer = (await inquirer.prompt([
    {
      type: 'list',
      name: 'protection',
      message: 'Which protection type do you want to use?',
      choices: ['public', 'restrictToRoleIds'],
    },
  ])) as { protection: 'public' | 'restrictToRoleIds' }
  if (protectionTypeAnswer.protection === 'restrictToRoleIds') {
    const roleIdsAnswer = (await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'roleIds',
        message: 'Which roleIds do you want to use?',
        choices: Object.values(Role),
      },
    ])) as { roleIds: string[] }
    protection = {
      type: 'restrictToRoleIds',
      roleIds: roleIdsAnswer.roleIds,
    }
  } else {
    protection = {
      type: 'public',
    }
  }
  return protection
}
