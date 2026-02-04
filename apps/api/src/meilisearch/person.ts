import prisma from '../prisma.js'

import { meilisearchClient, updateSettings } from './index.js'

const searchIndex = 'person'

type MeiliPerson = {
  id: string
  firstname: string
  lastname: string
  birthday: Date | null
  email: string
  gliederung: {
    id: string
    name: string
  } | null
}

export async function updateMeiliPerson(person: MeiliPerson) {
  try {
    await meilisearchClient.index(searchIndex).addDocuments([person])
  } catch (error) {
    console.error('updateMeiliPerson', error, person)
  }
}

export async function deleteMeiliPerson(id: string) {
  try {
    await meilisearchClient.index(searchIndex).deleteDocument(id)
  } catch (error) {
    console.error('deleteMeiliPerson', error, id)
  }
}

export async function syncAllPersonsToMeili() {
  await meilisearchClient.index(searchIndex).updateSettings(updateSettings)
  await meilisearchClient.updateIndex(searchIndex, { primaryKey: 'id' })

  let cursorValue: string | undefined
  const batchSize = 1000
  do {
    const skip: number = cursorValue ? 1 : 0
    const cursor: { id: string } | undefined = cursorValue ? { id: cursorValue } : undefined
    const persons = await prisma.person.findMany({
      take: batchSize,
      skip,
      cursor,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        birthday: true,
        email: true,
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    await meilisearchClient.index(searchIndex).addDocuments(persons)
    if (persons.length < batchSize) cursorValue = undefined
    else cursorValue = persons[persons.length - 1]?.id
  } while (cursorValue)
}
