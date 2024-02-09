import { Essgewohnheit, Gender, PrismaClient } from '@prisma/client'

import { Seeder } from '.'

const createAnmeldung: Seeder = async function (prisma: PrismaClient) {
  const unterveranstaltung = await prisma.unterveranstaltung.findFirstOrThrow()

  await prisma.anmeldung.create({
    data: {
      unterveranstaltung: {
        connect: {
          id: unterveranstaltung.id,
        },
      },
      status: 'OFFEN',
      person: {
        create: {
          firstname: 'Steffen',
          lastname: 'Super',
          email: 'steffen.super@example.org',
          telefon: '+49 123 4567890',
          gender: Gender.MALE,
          birthday: new Date(),
          essgewohnheit: Essgewohnheit.OMNIVOR,
          konfektionsgroesse: 'XL',
          address: {
            create: {
              city: 'Flensburg',
              zip: '24941',
              street: 'Holm',
              number: '16',
            },
          },
          gliederung: {
            connect: {
              edv: '1205013',
            },
          },
        },
      },
    },
  })
}

export default createAnmeldung
