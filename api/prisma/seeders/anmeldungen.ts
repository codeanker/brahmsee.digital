import { fakerDE as faker } from '@faker-js/faker'
import { AnmeldungStatus, Essgewohnheit, Gender, PrismaClient } from '@prisma/client'

import { Seeder } from '.'

faker.seed(123)

const createAnmeldung: Seeder = async function (prisma: PrismaClient) {
  const unterveranstaltung = await prisma.unterveranstaltung.findFirstOrThrow()
  const entryCount = 100

  for (let i = 0; i < entryCount; i++) {
    const address = await prisma.address.create({
      data: {
        city: faker.location.city(),
        zip: faker.location.zipCode(),
        street: faker.location.street(),
        number: faker.location.buildingNumber(),
      },
    })

    const person = await prisma.person.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.firstName(),
        birthday: faker.date.birthdate({ min: 12, max: 30, mode: 'age' }),
        gender: faker.helpers.enumValue(Gender),
        email: faker.internet.email(),
        telefon: faker.string.numeric('+49151########'),
        essgewohnheit: faker.helpers.enumValue(Essgewohnheit),
        konfektionsgroesse: faker.helpers.arrayElement(['S', 'M', 'L', 'XL', 'XXL']),
        addressId: address.id,
        gliederungId: unterveranstaltung.gliederungId,
      },
    })

    await prisma.anmeldung.create({
      data: {
        unterveranstaltungId: unterveranstaltung.id,
        status: faker.helpers.enumValue(AnmeldungStatus),
        tshirtBestellt: faker.datatype.boolean(),
        personId: person.id,
      },
    })
  }
}

export default createAnmeldung
