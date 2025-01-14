import { z } from 'zod'
import client from '../../prisma.js'

export const settingsSchema = z.strictObject({
  enablePersonPhotos: z.boolean(),
  enableThshirtOrder: z.boolean(),
})

export type Settings = z.infer<typeof settingsSchema>

export const settingsDefaults: Settings = {
  enablePersonPhotos: false,
  enableThshirtOrder: true,
}

export async function populateDefaultSettings(veranstaltungId: number) {
  await client.veranstaltung.update({
    where: {
      id: veranstaltungId,
    },
    data: {
      settings: settingsDefaults,
    },
  })

  return settingsDefaults
}
