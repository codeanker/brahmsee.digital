import { AnmeldungStatus, Essgewohnheit, NahrungsmittelIntoleranz } from '@prisma/client'
import dayjs from 'dayjs'
import type { Context } from 'hono'
import XLSX from '@e965/xlsx'
import prisma from '../../../prisma.js'
import { getSecurityWorksheet } from '../helpers/getSecurityWorksheet.js'
import { getWorkbookDefaultProps } from '../helpers/getWorkbookDefaultProps.js'
import { sheetAuthorize } from './sheets.schema.js'

export async function veranstaltungVerpflegung(ctx: Context) {
  const authorization = await sheetAuthorize(ctx)
  if (!authorization) {
    return
  }

  const { query, account, gliederung } = authorization

  const unterveranstaltungen = await prisma.unterveranstaltung.findMany({
    where: {
      OR: [{ id: query.unterveranstaltungId }, { veranstaltungId: query.veranstaltungId }],
      gliederungId: gliederung?.id,
    },
    select: {
      id: true,
      beschreibung: true,
      gliederung: {
        select: {
          id: true,
          name: true,
        },
      },
      Anmeldung: {
        where: {
          status: AnmeldungStatus.BESTAETIGT,
        },
        select: {
          person: {
            select: {
              id: true,
              essgewohnheit: true,
              nahrungsmittelIntoleranzen: true,
              weitereIntoleranzen: true,
            },
          },
        },
      },
    },
  })

  const header = [
    'id',
    'Unterveranstaltung',
    'Gliederung',
    'Gesamt',
    '',
    ...Object.values(Essgewohnheit),
    '',
    ...Object.values(NahrungsmittelIntoleranz),
    '',
    'weitere Intoleranzen',
  ]

  const rows = unterveranstaltungen.map((unterveranstaltung) => {
    const anmeldungen = unterveranstaltung.Anmeldung
    const aggregatedEssgewohnheiten = Object.fromEntries(
      Object.values(Essgewohnheit).map((essgewohnheit) => [
        essgewohnheit,
        anmeldungen.filter((anmeldung) => anmeldung.person.essgewohnheit === essgewohnheit).length,
      ])
    )
    const aggregatedNahrungsmittelIntoleranzen = Object.fromEntries(
      Object.values(NahrungsmittelIntoleranz).map((intoleranz) => [
        intoleranz,
        anmeldungen.filter((anmeldung) => anmeldung.person.nahrungsmittelIntoleranzen.includes(intoleranz)).length,
      ])
    )
    const weitereIntoleranzen = Array.from(
      new Set(anmeldungen.flatMap((anmeldung) => anmeldung.person.weitereIntoleranzen))
    ).join(', ')
    return [
      unterveranstaltung.id,
      unterveranstaltung.beschreibung,
      unterveranstaltung.gliederung?.name ?? '',
      anmeldungen.length,
      '',
      ...Object.values(aggregatedEssgewohnheiten),
      '',
      ...Object.values(aggregatedNahrungsmittelIntoleranzen),
      '',
      weitereIntoleranzen,
    ]
  })

  const workbook = XLSX.utils.book_new()

  /* get workbook defaults */
  const defaultWorkbookPros = getWorkbookDefaultProps(account)
  workbook.Props = {
    Title: 'Verpflegung',
    Subject: 'Verpflegungswünsche der Teilnehmenden',
    ...defaultWorkbookPros,
  }

  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows])
  worksheet['!cols'] = [{ wch: 6 }, { wch: 40 }]
  XLSX.utils.book_append_sheet(workbook, worksheet, `Verpflegung`)

  const { securityWorksheet, securityWorksheetName } = getSecurityWorksheet(account, rows.length)
  XLSX.utils.book_append_sheet(workbook, securityWorksheet, securityWorksheetName)

  const filename = `${dayjs().format('YYYYMMDD-hhmm')}-Verpflegung.xlsx`
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as ArrayBuffer

  ctx.header('Content-Disposition', `attachment; filename="${filename}"`)
  ctx.header('Content-Type', 'application/vnd.ms-excel')
  ctx.body(buffer, 201)
}
