import { PrismaClient } from '@prisma/client'

import { isProduction } from '../../src/util/is-production.js'

import type { Seeder } from './index.js'

import dayjs from 'dayjs'

const createProgramm: Seeder = async (prisma: PrismaClient) => {
  // create default user in development
  if (isProduction()) {
    return
  }

  const veranstaltung = await prisma.veranstaltung.findFirst()
  if (!veranstaltung) {
    return
  }

  await prisma.programmPunkt.createMany({
    data: [
      {
        veranstaltungId: veranstaltung.id,
        name: 'Eröffnungsveranstaltung',
        description: 'Wir freuen uns auf die Eröffnungsveranstaltung!',
        location: 'Sahara',
        responsible: 'Crew',
        startingAt: dayjs(veranstaltung.beginn).hour(18).minute(0).toDate(),
        endingAt: dayjs(veranstaltung.beginn).hour(20).minute(0).toDate(),
      },

      {
        veranstaltungId: veranstaltung.id,
        name: 'Punkt 1',
        location: 'Tippi',
        responsible: 'AK JuKi',
        startingAt: dayjs(veranstaltung.beginn).add(1, 'day').hour(8).minute(0).toDate(),
        endingAt: dayjs(veranstaltung.beginn).add(1, 'day').hour(10).minute(0).toDate(),
      },

      {
        veranstaltungId: veranstaltung.id,
        name: 'Punkt 2',
        location: 'Strand',
        responsible: 'Crew',
        startingAt: dayjs(veranstaltung.beginn).add(1, 'day').hour(13).minute(0).toDate(),
        endingAt: dayjs(veranstaltung.beginn).add(1, 'day').hour(16).minute(0).toDate(),
      },

      {
        veranstaltungId: veranstaltung.id,
        name: 'Punkt 3',
        location: 'Haus der Stille',
        responsible: 'Adventure Camp',
        startingAt: dayjs(veranstaltung.beginn).add(1, 'day').hour(8).minute(0).toDate(),
        endingAt: dayjs(veranstaltung.beginn).add(1, 'day').hour(18).minute(0).toDate(),
      },

      {
        veranstaltungId: veranstaltung.id,
        name: 'Abschlussveranstaltung',
        description: 'Wir freuen uns auf die Abschlussveranstaltung!',
        location: 'Sahara',
        responsible: 'Crew',
        startingAt: dayjs(veranstaltung.beginn).add(2, 'day').hour(18).minute(0).toDate(),
        endingAt: dayjs(veranstaltung.beginn).add(2, 'day').hour(20).minute(0).toDate(),
      },
    ],
  })
}

export default createProgramm
