import { fakerDE as faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

import logActivity from '../../src/util/activity.js'

import { Seeder } from '..js'

const createVeranstaltung: Seeder = async (prisma: PrismaClient) => {
  const veranstaltung = await prisma.veranstaltung.create({
    data: {
      name: 'Brahmsee 2024',
      beginn: new Date(),
      ende: new Date(),
      meldebeginn: new Date(),
      meldeschluss: new Date(),
      maxTeilnehmende: faker.number.int({ min: 7, max: 50 }),
      teilnahmegebuehr: faker.number.int({ min: 80, max: 110 }),
      beschreibung: faker.lorem.text(),
      datenschutz: faker.lorem.text(),
      teilnahmeBedingungen: faker.lorem.text(),
      teilnahmeBedingungenPublic: faker.lorem.text(),
      zielgruppe: faker.lorem.text(),
      hostname: {
        create: {
          hostname: 'localhost:8080',
        },
      },
      ort: {
        create: {
          name: 'Waldheim am Brahmsee',
          address: {
            create: {
              city: 'Langwedel',
              zip: '24631',
              streetNumber: '1',
              street: 'Am Waldheim',
              country: 'DE',
            },
          },
        },
      },
      unterveranstaltungen: {
        create: {
          teilnahmegebuehr: 13.37,
          maxTeilnehmende: 800,
          meldebeginn: new Date(),
          meldeschluss: new Date(),
          beschreibung: faker.lorem.text(),
          type: 'GLIEDERUNG',
          gliederung: {
            connect: {
              edv: '1205013',
            },
          },
        },
      },
    },
  })

  await prisma.customField.create({
    data: {
      name: 'Rolle',
      description: 'Dieses Feld wurde duch den Seeder erstellt',
      type: 'BASIC_SELECT',
      required: true,
      options: ['Schwimmer:in', 'Teilnehmer:in'],
      positions: ['PUBLIC_ANMELDUNG', 'INTERN_ANMELDUNG'],
      veranstaltungId: veranstaltung.id,
    },
  })

  await logActivity({
    type: 'CREATE',
    subjectType: 'veranstaltung',
    subjectId: veranstaltung.id,
    description: 'veranstaltung created via db seeder',
  })
}

export default createVeranstaltung
