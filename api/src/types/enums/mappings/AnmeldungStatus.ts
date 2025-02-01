import type { AnmeldungStatus } from '@prisma/client'

import { defineEnumMapping } from '../defineEnumMapping.js'

export const AnmeldungStatusMapping = defineEnumMapping<AnmeldungStatus>({
  OFFEN: { human: 'Offen', description: 'Anmeldung ist noch nicht bearbeitet.' },
  BESTAETIGT: { human: 'Bestätigt', description: 'Anmeldung ist bestätigt, die Teilnahme zugesagt.' },
  STORNIERT: { human: 'Storniert', description: 'Anmeldung wurde durch die Person storniert.' },
  ABGELEHNT: { human: 'Abgelehnt', description: 'Anmeldung wurde durch die Verwaltung abgelehnt.' },
})

export { type AnmeldungStatus }
