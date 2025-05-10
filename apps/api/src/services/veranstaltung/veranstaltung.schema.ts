import { z } from 'zod'
import client from '../../prisma.js'
import type { JsonValue } from '@prisma/client/runtime/library'

export const veranstaltungSettingsSchema = z.strictObject({
  enablePhotoUpload: z.boolean(),
})

export type VeranstaltungSettings = z.infer<typeof veranstaltungSettingsSchema>

export const veranstaltungSettingsDefaults: VeranstaltungSettings = {
  enablePhotoUpload: false,
}

export async function populateVeranstaltungSettings(veranstaltungId: number) {
  await client.veranstaltung.update({
    where: {
      id: veranstaltungId,
    },
    data: {
      settings: veranstaltungSettingsDefaults,
    },
  })
}

export function veranstaltungSettingsGet<K extends keyof VeranstaltungSettings>(
  raw: JsonValue,
  key: K
): VeranstaltungSettings[K] {
  return (raw as VeranstaltungSettings)[key]
}
