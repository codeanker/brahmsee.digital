import XLSX from '@e965/xlsx'
import dayjs from 'dayjs'
import type { Context } from 'hono'
import prisma from '../../prisma.js'
import { getSecurityWorksheet } from './helpers/getSecurityWorksheet.js'
import { getWorkbookDefaultProps } from './helpers/getWorkbookDefaultProps.js'
import type { AuthorizeResults } from './middleware/authorize.js'

export async function veranstaltungUnterschriftenliste(ctx: Context<{ Variables: AuthorizeResults }>) {
  const { query, account, gliederung } = ctx.var

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
          firstname: true,
          lastname: true,
          birthday: true,
          address: {
            select: {
              street: true,
              zip: true,
              city: true,
            },
          },
          gliederung: {
            select: {
              name: true,
            },
          },
        },
      },
      unterveranstaltung: {
        select: {
          beschreibung: true,
          gliederung: {
            select: {
              name: true,
            },
          },
          veranstaltung: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      person: {
        lastname: 'asc',
      },
    },
  })

  const rows = anmeldungenList.map((anmeldung, index) => {
    return {
      'Nr.': index + 1,
      Vorname: anmeldung.person.firstname,
      Name: anmeldung.person.lastname,
      'Straße, Hausnummer': anmeldung.person.address?.street ?? '',
      PLZ: anmeldung.person.address?.zip ?? '',
      Ort: anmeldung.person.address?.city ?? '',
      Geburtsdatum: anmeldung.person.birthday ? dayjs(anmeldung.person.birthday).format('DD.MM.YYYY') : '',
      Gliederung: anmeldung.person.gliederung?.name ?? anmeldung.unterveranstaltung.gliederung.name,
      Unterschrift: '',
    }
  })

  const workbook = XLSX.utils.book_new()

  /* get workbook defaults */
  const defaultWorkbookProps = getWorkbookDefaultProps(account)
  workbook.Props = {
    Title: 'Unterschriftenliste',
    Subject: 'Unterschriftenliste der Teilnehmenden',
    ...defaultWorkbookProps,
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
  
  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 5 },  // Nr.
    { wch: 15 }, // Vorname
    { wch: 15 }, // Name
    { wch: 25 }, // Straße, Hausnummer
    { wch: 8 },  // PLZ
    { wch: 15 }, // Ort
    { wch: 12 }, // Geburtsdatum
    { wch: 20 }, // Gliederung
    { wch: 20 }, // Unterschrift
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, `Unterschriftenliste`)

  /** add Security Worksheet */
  const { securityWorksheet, securityWorksheetName } = getSecurityWorksheet(account, rows.length)
  XLSX.utils.book_append_sheet(workbook, securityWorksheet, securityWorksheetName)

  const filename = `${dayjs().format('YYYYMMDD-HHmm')}-Unterschriftenliste.xlsx`
  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as ArrayBuffer

  ctx.header('Content-Disposition', `attachment; filename="${filename}"`)
  ctx.header('Content-Type', 'application/vnd.ms-excel')
  return ctx.body(buf, 200)
}
