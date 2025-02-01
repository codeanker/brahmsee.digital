/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Role } from '@prisma/client'
import dayjs from 'dayjs'
import XLSX from 'xlsx'

import { getEntityIdFromHeader } from '../../authentication.js'
import prisma from '../../prisma.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { getSecurityWorksheet } from '../helpers/getSecurityWorksheet.js'
import { AnmeldungStatusMapping } from '../../types/enums/mappings/AnmeldungStatus.js'
import { GenderMapping } from '../../types/enums/mappings/Gender.js'

export async function veranstaltungTeilnehmendenliste(ctx) {
  const jwt = ctx.query.jwt
  const accountId = getEntityIdFromHeader('Bearer ' + jwt)
  const unterveranstaltungId = ctx.query.unterveranstaltungId
  const veranstaltungId = ctx.query.veranstaltungId

  if (accountId == null || (unterveranstaltungId == null && veranstaltungId == null)) {
    ctx.res.statusCode = 401
    ctx.res.end()
    return
  }

  const account = await prisma.account.findUnique({
    where: {
      id: parseInt(accountId),
    },
    select: {
      role: true,
      person: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  })

  if (account == null) {
    ctx.res.statusCode = 401
    ctx.res.end()
    return
  }

  let gliederung
  if (account.role == Role.GLIEDERUNG_ADMIN) {
    try {
      gliederung = await getGliederungRequireAdmin(parseInt(accountId))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      ctx.res.statusCode = 401
      ctx.res.end()
      return
    }
  }

  const anmeldungenList = await prisma.anmeldung.findMany({
    where: {
      OR: [
        {
          unterveranstaltungId: parseInt(unterveranstaltungId || -1),
        },
        {
          unterveranstaltung: {
            veranstaltungId: parseInt(veranstaltungId || -1),
          },
        },
      ],
      unterveranstaltung: {
        gliederungId: gliederung?.id,
      },
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
          essgewohnheit: true,
          gliederung: {
            select: {
              id: true,
              name: true,
            },
          },
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
          veranstaltung: {
            select: {
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
    return {
      ['id']: anmeldung.id,
      ['Status']: AnmeldungStatusMapping[anmeldung.status].human,
      ['Gender']: anmeldung.person.gender ? GenderMapping[anmeldung.person.gender].human : '',
      ['Vorname']: anmeldung.person.firstname,
      ['Nachname']: anmeldung.person.lastname,
      ['Geburtstag']: anmeldung.person.birthday,
      ['Alter zu Beginn']: dayjs(anmeldung.unterveranstaltung.veranstaltung.beginn).diff(
        anmeldung.person.birthday,
        'years'
      ),
      ['Gliederung']: anmeldung.person.gliederung?.name,
      ['Email']: anmeldung.person.email,
      ['Telefon']: anmeldung.person.telefon,
      ['Essgewohnheit']: anmeldung.person.essgewohnheit,
      ['Anmeldedatum']: anmeldung.createdAt,
      ...customFields,

      ['PLZ']: anmeldung.person.address?.zip,
      ['Stadt']: anmeldung.person.address?.city,
      ['Straße']: anmeldung.person.address?.street,
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
  XLSX.utils.book_append_sheet(workbook, worksheet, `Teilnehmendenliste`)

  /** add Security Worksheet */
  const { securityWorksheet, securityWorksheetName } = getSecurityWorksheet(XLSX, account, rows.length)
  XLSX.utils.book_append_sheet(workbook, securityWorksheet, securityWorksheetName)

  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  /* prepare response headers */
  ctx.res.statusCode = 200
  const filename = `${dayjs().format('YYYYMMDD-hhmm')}-Teilnehmenden.xlsx`
  ctx.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  ctx.res.setHeader('Content-Type', 'application/vnd.ms-excel')
  ctx.res.end(buf)
}
