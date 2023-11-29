import { input, password as passwordInput, select } from '@inquirer/prompts'

import { getEnumOptions, roleMapping } from '../enumMappings'
import prisma from '../prisma'
import { getAccountCreateData } from '../services/account/schema/account.schema'

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
  await prisma.account.create({
    data: await getAccountCreateData({
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
      roleId: roleId,
      isActiv: true,
    }),
    select: {
      id: true,
    },
  })
  // eslint-disable-next-line no-console
  console.log('Nutzer erstellt')
  process.exit()
}
