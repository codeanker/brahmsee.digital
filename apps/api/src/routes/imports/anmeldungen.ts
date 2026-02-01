import { dayjs } from '@codeanker/helpers'
import prisma from '../../prisma.js'
import { inputSchema as anmeldungCreateSchema } from '../../services/anmeldung/anmeldungPublicCreate.js'
import { getPersonCreateData } from '../../services/person/schema/person.schema.js'
import { customFieldValuesCreateMany } from '../../types/defineCustomFieldValues.js'
import { z } from 'zod'

const rowSchema = z.object({
  vorname: z.string(),
  nachname: z.string(),
  geschlecht: z.string(),
  email: z.string(),
  telefon: z.string(),
  strasse: z.string(),
  geburtstag: z.string(),
  hausnummer: z.string(),
  plz: z.string(),
  ort: z.string(),
  essgewohnheit: z.string(),
  nahrungsmittelIntoleranzen: z.string(),
  weitereIntoleranzen: z.string(),
  notfallkontaktVorname: z.string(),
  notfallkontaktNachname: z.string(),
  notfallkontaktTelefon: z.string(),
  istErziehungsberechtigt: z.string(),
  comment: z.string(),
})

/**
 * Erstelle Anmeldung in der Datenbank
 * @param row
 * @param unterveranstaltungId
 */
export async function createAnmeldung(payload: unknown, unterveranstaltung: { id: string; gliederungId: string }) {
  try {
    const row = rowSchema.parse(payload)
    const mappedRow = {
      data: {
        gliederungId: unterveranstaltung.gliederungId,
        unterveranstaltungId: unterveranstaltung.id,
        //Person Schema
        firstname: row.vorname,
        lastname: row.nachname,
        birthday: dayjs(row.geburtstag, 'DD.MM.YYYY').toDate(),
        gender: row.geschlecht,
        email: row.email,
        telefon: row.telefon,
        address: {
          street: row.strasse,
          streetNumber: row.hausnummer,
          zip: row.plz,
          city: row.ort,
          country: 'DE',
          valid: false,
        },
        essgewohnheit: row.essgewohnheit,
        nahrungsmittelIntoleranzen: formatNahrungsmittelIntoleranzen(row.nahrungsmittelIntoleranzen),
        weitereIntoleranzen: formatNahrungsmittelIntoleranzen(row.weitereIntoleranzen),
        notfallkontaktPersonen: [
          {
            firstname: row.notfallkontaktVorname,
            lastname: row.notfallkontaktNachname,
            telefon: row.notfallkontaktTelefon,
            istErziehungsberechtigt: row.istErziehungsberechtigt === 'Ja' ? true : false,
          },
        ],
      },
      customFieldValues: mapCustomFields(row),
    }

    const validatedData = anmeldungCreateSchema.parse(mappedRow)
    const personData = await getPersonCreateData(validatedData.data)
    await prisma.person.create({
      data: {
        ...personData,
        anmeldungen: {
          create: {
            unterveranstaltungId: unterveranstaltung.id,
            comment: validatedData.data.comment,
            createdAt: new Date(),
            customFieldValues: {
              createMany: customFieldValuesCreateMany(validatedData.customFieldValues),
            },
          },
        },
      },
    })
  } catch (e) {
    console.error('Anmeldung konnte nicht erstellt werden', payload, e)
  }
}

function formatNahrungsmittelIntoleranzen(nahrungsmittelIntoleranzen: string) {
  if (!nahrungsmittelIntoleranzen) return []
  return nahrungsmittelIntoleranzen.split(',').map((item) => item.trim())
}

function mapCustomFields(obj: Record<string, string>) {
  const customFields: { fieldId: string; value: string | boolean }[] = []
  for (const key in obj) {
    if (key.startsWith('customFieldId_')) {
      if (!obj[key]) continue
      customFields.push({
        fieldId: key.replace('customFieldId_', ''),
        value: parseValue(obj[key]),
      })
    }
  }
  return customFields
}

function parseValue(value: string) {
  if (value === 'Ja') return true
  if (value === 'Nein') return false
  return value
}
