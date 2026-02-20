import { fakerDE as faker } from '@faker-js/faker'
import {
  AnmeldungStatus,
  Essgewohnheit,
  Gender,
  NahrungsmittelIntoleranz,
  PrismaClient,
  type Unterveranstaltung,
} from '@prisma/client'

import logActivity from '../../src/util/activity.js'

import type { Seeder } from './index.js'

const ENTRY_COUNT = 100

faker.seed(123)

async function create(prisma: PrismaClient, unterveranstaltung: Unterveranstaltung): Promise<void> {
  const address = await prisma.address.create({
    data: {
      city: faker.location.city(),
      zip: faker.location.zipCode(),
      street: faker.location.street(),
      streetNumber: faker.location.buildingNumber(),
      country: 'DE',
    },
    select: {
      id: true,
    },
  })

  await logActivity({
    type: 'CREATE',
    subjectType: 'address',
    subjectId: address.id,
    description: 'address created via db seeder',
  })

  // Make sure the email isn't NOT based on the person's name
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const mail = faker.internet.email({ firstName, lastName })

  const account = await prisma.account.create({
    data: {
      email: mail,
      role: 'USER',
      activatedAt: new Date(),
      status: 'AKTIV',
      person: {
        create: {
          firstname: firstName,
          lastname: lastName,
          birthday: faker.date.birthdate({ min: 12, max: 30, mode: 'age' }),
          gender: faker.helpers.enumValue(Gender),
          email: mail,
          telefon: faker.string.numeric('+49151########'),
          essgewohnheit: faker.helpers.enumValue(Essgewohnheit),
          nahrungsmittelIntoleranzen: faker.helpers.arrayElements(Object.values(NahrungsmittelIntoleranz)),
          addressId: address.id,
          gliederungId: unterveranstaltung.gliederungId,
          notfallkontakte: {
            create: [
              {
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                telefon: faker.string.numeric('+49151########'),
                istErziehungsberechtigt: faker.datatype.boolean(),
              },
            ],
          },
        },
      },
    },
    select: {
      id: true,
      personId: true,
    },
  })

  await logActivity({
    type: 'CREATE',
    subjectType: 'person',
    subjectId: account.id,
    description: 'person created via db seeder',
  })

  const anmeldung = await prisma.anmeldung.create({
    data: {
      unterveranstaltungId: unterveranstaltung.id,
      status: faker.helpers.enumValue(AnmeldungStatus),
      personId: account.personId,
      accountId: account.id,
      comment: faker.lorem.sentence(),
    },
    select: {
      id: true,
    },
  })

  await logActivity({
    type: 'CREATE',
    subjectType: 'anmeldung',
    subjectId: anmeldung.id,
    description: 'anmeldung created via db seeder',
  })
}

const createAnmeldung: Seeder = async function (prisma: PrismaClient) {
  const unterveranstaltung = await prisma.unterveranstaltung.findFirstOrThrow()

  const promises: Promise<void>[] = []
  for (let i = 0; i < ENTRY_COUNT; i++) {
    promises.push(create(prisma, unterveranstaltung))
  }

  await Promise.all(promises)
}

export default createAnmeldung
