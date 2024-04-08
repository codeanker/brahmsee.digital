import * as fs from 'fs'
import * as path from 'path'

import * as csv from 'fast-csv'
import type { Middleware } from 'koa'

import prisma from '../prisma'
import { inputSchema as anmeldungCreateSchema } from '../services/anmeldung/anmeldungPublicCreate'
import { getPersonCreateData } from '../services/person/schema/person.schema'
import { customFieldValuesCreateMany } from '../types/defineCustomFieldValues'

import { customParseFormat, dayjs } from '@codeanker/helpers'

dayjs.extend(customParseFormat)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const importAnmeldungen: Middleware = async function (ctx, next) {
  if (!ctx.request.files || !ctx.request.body.unterveranstaltungId) {
    ctx.response.status = 400
    ctx.response.message = 'Es wurden keine Dateien oder Unterveranstaltung übergeben'
    return
  }

  let files: any = []
  if (Array.isArray(ctx.request.files.files)) {
    files = ctx.request.files.files
  } else {
    files.push(ctx.request.files.files)
  }

  files.filter((file: any) => {
    if (file.mimetype !== 'text/csv') {
      ctx.response.status = 406
      ctx.response.message = 'Datei muss vom Typ CSV sein'
      return
    }
  })

  const unterveranstaltung = await findUnterveranstaltung(parseInt(ctx.request.body.unterveranstaltungId))
  if (!unterveranstaltung) {
    ctx.response.status = 400
    ctx.response.message = 'Unterveranstaltung nicht gefunden'
    return
  }

  files.forEach((file) => {
    fs.createReadStream(path.resolve(file.filepath))
      .pipe(csv.parse({ headers: true, delimiter: ';', ignoreEmpty: true }))
      .on('error', (error) => console.error(error))
      .on('data', (row) => createAnmeldung(row, unterveranstaltung))
      // eslint-disable-next-line no-console
      .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`))

    ctx.response.status = 200
    ctx.response.body = {
      ok: true,
    }
  })
}

/**
 * Erstelle Anmeldung in der Datenbank
 * @param row
 * @param unterveranstaltungId
 */
async function createAnmeldung(row: any, unterveranstaltung) {
  // console.log(unterveranstaltungId, row)

  try {
    const mappedRow = {
      data: {
        gliederungId: unterveranstaltung.gliederungId,
        unterveranstaltungId: unterveranstaltung.id,
        //Person Schema
        firstname: row.vorname,
        lastname: row.nachname,
        birthday: dayjs(row.geburtstag, 'DD.MM.YY').toDate(),
        gender: row.geschlecht,
        email: row.email,
        telefon: row.telefon,
        address: {
          street: row.strasse,
          number: row.hausnummer,
          zip: row.plz,
          city: row.ort,
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
      customFieldValues: [
        {
          fieldId: parseInt(row.customField1Id),
          value: row.customField1Value,
        },
      ],
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
    throw new Error(e)
  }
}
/**
 * Suche nach der passenden Unterveranstaltung anhand der ID
 * @param unterveranstaltungId
 * @returns
 */
async function findUnterveranstaltung(unterveranstaltungId: number) {
  return await prisma.unterveranstaltung.findUnique({
    where: {
      id: unterveranstaltungId,
    },
    select: {
      id: true,
      gliederungId: true,
    },
  })
}

function formatNahrungsmittelIntoleranzen(nahrungsmittelIntoleranzen: string) {
  if (!nahrungsmittelIntoleranzen) return []
  return nahrungsmittelIntoleranzen.split(',').map((item) => item.trim())
}
