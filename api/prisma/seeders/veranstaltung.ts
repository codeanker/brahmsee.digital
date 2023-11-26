import { PrismaClient } from '@prisma/client'

import { isProduction } from '../../src/util/is-production'

import { Seeder } from '.'

const createVeranstaltung: Seeder = async (prisma: PrismaClient) => {
  if (isProduction()) {
    return
  }

  await prisma.veranstaltung.create({
    data: {
      name: 'Brahmsee 2024',
      beginn: new Date(),
      ende: new Date(),
      meldebeginn: new Date(),
      meldeschluss: new Date(),
      maxTeilnehmende: 500,
      teilnahmegebuehr: 100,
      ort: {
        create: {
          name: 'Waldheim am Brahmsee',
          address: {
            create: {
              city: 'Langwedel',
              zip: '24631',
              number: '1',
              street: 'Am Waldheim',
            },
          },
        },
      },
    },
  })
}

export default createVeranstaltung
