import { AnmeldungStatus, Essgewohnheit, NahrungsmittelIntoleranz, Role } from '@prisma/client'
import dayjs from 'dayjs'
import XLSX from 'xlsx'

import { getEntityIdFromHeader } from '../../authentication'
import prisma from '../../prisma'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'
import { getSecurityWorksheet } from '../helpers/getSecurityWorksheet'
import { getWorkbookDefaultProps } from '../helpers/getWorkbookDefaultProps'

export async function veranstaltungVerpflegung(ctx) {
  const jwt = ctx.query.jwt
  const accountId = await getEntityIdFromHeader('Bearer ' + jwt)
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

  let gliederung: { id: number; name: string } | undefined
  if (account.role == Role.GLIEDERUNG_ADMIN) {
    try {
      gliederung = await getGliederungRequireAdmin(parseInt(accountId))
    } catch (error) {
      ctx.res.statusCode = 401
      ctx.res.end()
      return
    }
  }

  const gliederungen = await prisma.gliederung.findMany({
    where: {
      id: gliederung?.id,
      unterveranstaltungen: {
        some: {
          OR: [
            {
              id: parseInt(unterveranstaltungId || -1),
            },
            {
              veranstaltungId: parseInt(veranstaltungId || -1),
            },
          ],
        },
      },
    },
    select: {
      id: true,
      name: true,
      unterveranstaltungen: {
        where: {
          OR: [
            {
              id: parseInt(unterveranstaltungId || -1),
            },
            {
              veranstaltungId: parseInt(veranstaltungId || -1),
            },
          ],
        },
        select: {
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
      },
    },
  })

  const header = [
    'id',
    'Gliederung',
    ...Object.values(Essgewohnheit),
    '',
    ...Object.values(NahrungsmittelIntoleranz),
    '',
    'weitere Intoleranzen',
  ]

  const rows = gliederungen
    .filter((gliederung) => gliederung.unterveranstaltungen[0]?.Anmeldung.length > 0) // Filtere Gliederungen ohne Anmeldungen
    .map((gliederung) => {
      const anmeldungen = gliederung.unterveranstaltungen[0].Anmeldung
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
        gliederung.id,
        gliederung.name,
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

  const worksheet = XLSX.utils.json_to_sheet([header, ...rows])
  worksheet['!cols'] = [{ wch: 6 }, { wch: 40 }]
  XLSX.utils.book_append_sheet(workbook, worksheet, `Verpflegung`)

  /** add Security Worksheet */
  const { securityWorksheet, securityWorksheetName } = getSecurityWorksheet(XLSX, account, rows.length)
  XLSX.utils.book_append_sheet(workbook, securityWorksheet, securityWorksheetName)

  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  /* prepare response headers */
  ctx.res.statusCode = 200
  const filename = `${dayjs().format('YYYYMMDD-hhmm')}-Verpflegung.xlsx`
  ctx.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  ctx.res.setHeader('Content-Type', 'application/vnd.ms-excel')
  ctx.res.end(buf)
}
