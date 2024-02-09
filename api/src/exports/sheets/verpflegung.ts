import { AnmeldungStatus, Essgewohnheit, NahrungsmittelIntoleranz, Role } from '@prisma/client'
import dayjs from 'dayjs'
import XLSX from 'xlsx'

import { getEntityIdFromHeader } from '../../authentication'
import prisma from '../../prisma'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'
import { getSecurityWorksheet } from '../helpers/getSecurityWorksheet'
import { getWorkbookDefaultProps } from '../helpers/getWorkbookDefaultProps'

export async function veranstaltungVerpflegung(ctx, next: () => Promise<void>) {
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

  let gliederung
  if (account.role == Role.GLIEDERUNG_ADMIN) {
    try {
      gliederung = await getGliederungRequireAdmin(parseInt(accountId))
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
      status: AnmeldungStatus.BESTAETIGT,
    },
    select: {
      id: true,
      person: {
        select: {
          id: true,
          gliederung: {
            select: {
              id: true,
              name: true,
            },
          },
          essgewohnheit: true,
          nahrungsmittelIntoleranzen: true,
          weitereIntoleranzen: true,
        },
      },
    },
  })

  const gliederungen = anmeldungenList
    .map((anmeldung) => anmeldung.person.gliederung?.name)
    .filter((value, index, self) => self.indexOf(value) === index)

  const anmeldungenGliederung = gliederungen.map((gliederung) => {
    return anmeldungenList
      .filter((anmeldung) => anmeldung.person.gliederung?.name === gliederung)
      .map((anmeldung) => {
        return {
          gliederung: anmeldung.person.gliederung,
          essgewohnheit: anmeldung.person.essgewohnheit,
          nahrungsmittelIntoleranz:
            anmeldung.person.nahrungsmittelIntoleranzen.length > 0 ? anmeldung.person.nahrungsmittelIntoleranzen : null,
          weitereIntoleranzen: anmeldung.person.weitereIntoleranzen,
        }
      })
  })

  const rows = aggregiereDaten(anmeldungenGliederung)

  const workbook = XLSX.utils.book_new()

  /* get workbook defaults */
  const defaultWorkbookPros = getWorkbookDefaultProps(account)
  workbook.Props = {
    Title: 'Verpflegung',
    Subject: 'Verpflegungswünsche der Teilnehmenden',
    ...defaultWorkbookPros,
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
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
  await next()
  ctx.res.end(buf)
}

function aggregiereDaten(daten: any[][]) {
  const result: any = []

  daten.forEach((array) => {
    const aggregatedData: any = {
      gliederung: array[0].gliederung,
      essgewohnheit: {},
      nahrungsmittelIntoleranz: {},
      weitereIntoleranzen: [],
    }

    array.forEach((eintrag) => {
      const essgewohnheit = eintrag.essgewohnheit
      const intoleranzen = eintrag.nahrungsmittelIntoleranz || []
      // Aggregation der Essgewohnheiten
      if (essgewohnheit) {
        aggregatedData.essgewohnheit[essgewohnheit] = (aggregatedData.essgewohnheit[essgewohnheit] || 0) + 1
      }

      // Aggregation der Nahrungsmittel-Intoleranzen
      intoleranzen.forEach((intoleranz: string) => {
        aggregatedData.nahrungsmittelIntoleranz[intoleranz] =
          (aggregatedData.nahrungsmittelIntoleranz[intoleranz] || 0) + 1
      })

      aggregatedData.weitereIntoleranzen = Array.from(
        new Set(aggregatedData.weitereIntoleranzen.concat(eintrag.weitereIntoleranzen))
      )
    })

    result.push(aggregatedData)
  })

  // Daten Transformieren damit diese exportiert werden können

  return result.map((eintrag) => {
    const result: any = {}

    // Transformiere Essgewohnheiten
    Object.keys(eintrag.essgewohnheit).forEach((essgewohnheit) => {
      result[essgewohnheit] = eintrag.essgewohnheit[essgewohnheit]
    })

    // Füge fehlende Werte mit 0 hinzu
    Object.values(Essgewohnheit).forEach((essgewohnheit) => {
      if (!result[essgewohnheit]) result[essgewohnheit] = 0
    })

    result[''] = ''

    // Transformiere Nahrungsmittel-Intoleranzen
    Object.keys(eintrag.nahrungsmittelIntoleranz).forEach((intoleranz) => {
      result[intoleranz] = eintrag.nahrungsmittelIntoleranz[intoleranz]
    })

    // Füge fehlende Werte mit 0 hinzu
    Object.values(NahrungsmittelIntoleranz).forEach((intoleranz) => {
      if (!result[intoleranz]) result[intoleranz] = 0
    })

    result[' '] = ''

    result['weitere Intoleranzen'] = eintrag.weitereIntoleranzen.join(', ')

    return { id: eintrag.gliederung.id, Gliederung: eintrag.gliederung.name, ...result }
  })
}
