import { input, password as passwordInput, select } from '@inquirer/prompts'

import { getEnumOptions, roleMapping } from '../enumMappings'
import prisma from '../prisma'
import { getAccountCreateData } from '../services/account/schema/account.schema'
import logActivity from '../util/activity'

createUser()
async function createUser() {
  const email = await input({ message: 'E-Mail' })
  const firstname = await input({ message: 'Vorname' })
  const lastname = await input({ message: 'Nachname' })
  const password = await passwordInput({ message: 'Passwort' })
  const roleId = (await select({
    message: 'Rolle',
    choices: getEnumOptions(roleMapping).map((option) => {
      return {
        name: option.label,
        value: option.value,
      }
    }),
  })) as keyof typeof roleMapping

  async function selectGliederung(): Promise<number> {
    return await select({
      message: 'Deine Gliederung',
      choices: (await prisma.gliederung.findMany()).map((v) => ({
        name: v.name,
        value: v.id,
      })),
    })
  }

  const accountData = await getAccountCreateData({
    email: email,
    firstname: firstname,
    lastname: lastname,
    password: password,
    roleId: roleId,
    isActiv: true,
    adminInGliederungId: roleId === 'GLIEDERUNG_ADMIN' ? await selectGliederung() : undefined,
    birthday: new Date(),
    gender: 'FEMALE',
  })

  const res = await prisma.account.create({
    data: {
      ...accountData,
      status: 'AKTIV',
      activationToken: null,
    },
    select: {
      id: true,
    },
  })

  await logActivity({
    type: 'CREATE',
    description: `account was created via CLI script`,
    subjectType: 'account',
    subjectId: res.id,
  })

  // eslint-disable-next-line no-console
  console.log('Nutzer erstellt')
  process.exit()
}
