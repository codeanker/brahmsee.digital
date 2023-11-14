import { input, password as passwordInput, select } from '@inquirer/prompts'

import { getEnumOptions, roleMapping } from '../enumMappings'
import prisma from '../prisma'
import { hashPassword } from '../services/authentication'

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
  await prisma.user.create({
    data: {
      email: email,
      password: await hashPassword(password),
      firstname: firstname,
      lastname: lastname,
      role: roleId,
    },
  })
  // eslint-disable-next-line no-console
  console.log('Nutzer erstellt')
  process.exit()
}
