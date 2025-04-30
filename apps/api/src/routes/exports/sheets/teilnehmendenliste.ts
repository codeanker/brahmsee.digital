import XLSX from '@e965/xlsx'
import dayjs from 'dayjs'
import type { Context } from 'koa'
import { AnmeldungStatusMapping, GenderMapping } from '../../../client.js'
import prisma from '../../../prisma.js'
import { getSecurityWorksheet } from '../helpers/getSecurityWorksheet.js'
import { sheetAuthorize } from './sheets.schema.js'

export async function veranstaltungTeilnehmendenliste(ctx: Context) {
  const authorization = await sheetAuthorize(ctx)
  if (!authorization) {
    return
  }

  const { query, account, gliederung } = authorization

  const anmeldungenList = await prisma.anmeldung.findMany({
    where: {
      OR: [
        {
          unterveranstaltungId: query.unterveranstaltungId,
        },
        {
          unterveranstaltung: {
            veranstaltungId: query.veranstaltungId,
          },
        },
      ],
      unterveranstaltung: {
        gliederungId: gliederung?.id,
      },
      status: 'BESTAETIGT',
    },
    select: {
      id: true,
      person: {
        select: {
          id: true,
          gender: true,
          firstname: true,
          lastname: true,
          birthday: true,
          email: true,
          telefon: true,
          photo: {
            select: {
              id: true,
              mimetype: true,
            },
          },
          essgewohnheit: true,
          address: {
            select: {
              zip: true,
              city: true,
              street: true,
            },
          },
          notfallkontakte: {
            select: {
              firstname: true,
              lastname: true,
              telefon: true,
              istErziehungsberechtigt: true,
            },
          },
        },
      },
      createdAt: true,
      status: true,
      unterveranstaltung: {
        select: {
          beschreibung: true,
          type: true,
          gliederung: {
            select: {
              name: true,
            },
          },
          veranstaltung: {
            select: {
              name: true,
              meldeschluss: true,
              beginn: true,
            },
          },
        },
      },
      customFieldValues: {
        select: {
          field: {
            select: {
              id: true,
              name: true,
            },
          },
          value: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const rows = anmeldungenList.map((anmeldung) => {
    const customFields = anmeldung.customFieldValues
      .map((customField) => {
        return {
          [customField.field.name]: customField.value,
        }
      })
      .reduce((acc, cur) => ({ ...acc, ...cur }), {})

    const age = dayjs(anmeldung.unterveranstaltung.veranstaltung.beginn).diff(anmeldung.person.birthday, 'years')

    return {
      '#': anmeldung.id,

      Veranstaltung: anmeldung.unterveranstaltung.veranstaltung.name,
      Ausschreibung:
        anmeldung.unterveranstaltung.beschreibung?.substring(0, 30) || anmeldung.unterveranstaltung.gliederung.name,
      'Art der Ausschreibung': anmeldung.unterveranstaltung.type,

      Status: AnmeldungStatusMapping[anmeldung.status].human,
      Anmeldedatum: anmeldung.createdAt,
      Foto: anmeldung.person.photo ? 'Ja' : 'Nein',

      Geschlecht: anmeldung.person.gender ? GenderMapping[anmeldung.person.gender].human : '',
      Vorname: anmeldung.person.firstname,
      Nachname: anmeldung.person.lastname,
      Geburtstag: anmeldung.person.birthday,
      'Alter zu Beginn': age,
      Email: anmeldung.person.email,
      Telefon: anmeldung.person.telefon,
      Essgewohnheit: anmeldung.person.essgewohnheit,

      PLZ: anmeldung.person.address?.zip ?? '',
      Stadt: anmeldung.person.address?.city ?? '',
      Straße: anmeldung.person.address?.street ?? '',

      ...customFields,

      ...anmeldung.person.notfallkontakte
        .map((kontakt, index) => ({
          [`NF ${index + 1} Vorname`]: kontakt.firstname,
          [`NF ${index + 1} Nachname`]: kontakt.lastname,
          [`NF ${index + 1} Telefon`]: kontakt.telefon,
          [`NF ${index + 1} Erziehungsberechtigt?`]: kontakt.istErziehungsberechtigt ? 'Ja' : '',
        }))
        .reduce<Record<string, string>>((a, b) => ({ ...a, ...b }), {}),
    }
  })
  const workbook = XLSX.utils.book_new()

  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet['!cols'] = [{ hidden: true }, { hidden: true }, { hidden: true }]

  XLSX.utils.book_append_sheet(workbook, worksheet, `Teilnehmendenliste`)

  /** add Security Worksheet */
  const { securityWorksheet, securityWorksheetName } = getSecurityWorksheet(account, rows.length)
  XLSX.utils.book_append_sheet(workbook, securityWorksheet, securityWorksheetName)

  const filename = `${dayjs().format('YYYYMMDD-hhmm')}-Teilnehmendenliste.xlsx`
  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer

  ctx.res.statusCode = 201
  ctx.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  ctx.res.setHeader('Content-Type', 'application/vnd.ms-excel')
  ctx.res.end(buf)
}
