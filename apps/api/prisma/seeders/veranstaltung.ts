import { fakerDE as faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

import logActivity from '../../src/util/activity.js'

import type { Seeder } from './index.js'
import { dayjs } from '@codeanker/helpers'
import { randomUUID } from 'node:crypto'

const createVeranstaltung: Seeder = async (prisma: PrismaClient) => {
  const beginn = dayjs().add(1, 'month')

  const veranstaltung = await prisma.veranstaltung.create({
    data: {
      name: 'Brahmsee 2024',
      beginn: beginn.toDate(),
      ende: beginn.add(2, 'day').toDate(),
      meldebeginn: beginn.subtract(1, 'month').toDate(),
      meldeschluss: beginn.subtract(1, 'week').toDate(),
      maxTeilnehmende: faker.number.int({ min: 7, max: 50 }),
      teilnahmegebuehr: faker.number.int({ min: 80, max: 110 }),
      beschreibung: faker.lorem.text(),
      datenschutz: faker.lorem.text(),
      teilnahmeBedingungen: faker.lorem.text(),
      teilnahmeBedingungenPublic: faker.lorem.text(),
      zielgruppe: faker.lorem.text(),
      publicReadToken: randomUUID(),
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
          meldebeginn: beginn.subtract(1, 'month').toDate(),
          meldeschluss: beginn.subtract(1, 'week').toDate(),
          beschreibung: faker.lorem.text(),
          type: 'GLIEDERUNG',
          gliederung: {
            connect: {
              edv: '1205013',
            },
          },
          landingSettings: {
            create: {
              heroTitle: faker.lorem.sentence(),
              heroSubtitle: faker.lorem.sentence(),
              eventDetailsTitle: faker.lorem.sentence(),
              eventDetailsContent: faker.lorem.paragraph(),
              miscellaneousVisible: true,
              miscellaneousTitle: faker.lorem.sentence(),
              miscellaneousItems: {
                create: Array(3)
                  .fill(0)
                  .map(() => ({
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraph(),
                  })),
              },
              faqVisible: true,
              faqEmail: faker.internet.email(),

              instagramVisible: true,
              instagramUrl: 'https://www.instagram.com/dlrgjugendsh',

              facebookVisible: true,
              facebookUrl: 'https://www.facebook.com/DLRGJugendSH/?locale=de_DE',
            },
          },
        },
      },
    },
    select: {
      id: true,
      unterveranstaltungen: {
        select: {
          id: true,
        },
      },
    },
  })

  const faqCategories = await prisma.faqCategory.createManyAndReturn({
    data: Array(3)
      .fill(0)
      .map(() => ({
        name: faker.color.human(),
        unterveranstaltungId: veranstaltung.unterveranstaltungen[0]!.id,
      })),
  })
  await prisma.faq.createMany({
    data: Array(9)
      .fill(0)
      .map(() => ({
        question: faker.commerce.productAdjective(),
        answer: faker.commerce.productDescription(),
        categoryId: faqCategories[Math.floor(Math.random() * faqCategories.length)]!.id,
      })),
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
