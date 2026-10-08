import { input, password as passwordInput, select, search } from '@inquirer/prompts'
import { Role } from '@prisma/client'

import prisma, { withoutQueryLogging } from '../prisma.js'
import { getAccountCreateData } from '../services/account/schema/account.schema.js'
import logActivity from '../util/activity.js'
import { getEnumOptions, roleMapping, GenderMapping } from '../client.js'

function parseBirthday(value: string): Date | undefined {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    return undefined
  }

  const day = Number(value.slice(0, 2))
  const month = Number(value.slice(3, 5))
  const year = Number(value.slice(6, 10))
  const birthday = new Date(Date.UTC(year, month - 1, day))

  if (
    birthday.getUTCFullYear() !== year ||
    birthday.getUTCMonth() !== month - 1 ||
    birthday.getUTCDate() !== day
  ) {
    return undefined
  }

  const today = new Date()
  const todayAtMidnight = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  if (birthday > todayAtMidnight) {
    return undefined
  }

  return birthday
}

async function createUser() {
  const email = await input({ message: 'E-Mail' })
  const firstname = await input({ message: 'Vorname' })
  const lastname = await input({ message: 'Nachname' })
  const password = await passwordInput({ message: 'Passwort' })
  
  const roleId = await select({
    message: 'Rolle',
    choices: getEnumOptions(roleMapping).map((option) => ({
      name: option.label,
      value: option.value,
    })),
  })

  const gliederungId = await withoutQueryLogging(() =>
    search({
      message: 'Deine Gliederung',
      source: async (term) => {
        const results = await prisma.gliederung.findMany({
          where: {
            name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        })

        return results.map((v) => ({
          name: v.name,
          value: v.id,
        }))
      },
    })
  )
  const birthdayInput = await input({
    message: 'Geburtsdatum (TT-MM-JJJJ)',
    validate: (value) =>
      parseBirthday(value) ? true : 'Bitte ein gültiges Datum im Format TT-MM-JJJJ eingeben, das nicht in der Zukunft liegt.',
  })
  const birthday = parseBirthday(birthdayInput)
  if (!birthday) {
    throw new Error('Ungültiges Geburtsdatum.')
  }

  const gender = await select({
    message: 'Geschlecht',
    choices: getEnumOptions(GenderMapping).map((option) => ({
      name: option.label,
      value: option.value,
    })),
  })

  const accountData = await getAccountCreateData({
    email,
    firstname,
    lastname,
    password,
    roleId,
    isActiv: true,
    gliederungId,
    adminInGliederungId:
      roleId === Role.GLIEDERUNG_ADMIN
        ? gliederungId
        : undefined,
    birthday,
    gender,
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
    description: 'account was created via CLI script',
    subjectType: 'account',
    subjectId: res.id,
  })

  console.log('Nutzer erstellt')
  process.exit()
}

await createUser()