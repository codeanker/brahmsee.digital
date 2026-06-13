import dayjs from 'dayjs'
import type { Context } from 'hono'
import prisma from '../../prisma.js'
import type { AuthorizeResults } from './middleware/authorize.js'

const COLUMNS = [
  'Mitgliedsnummer',
  'Datensatztyp',
  'Rechnungsinkrement',
  'Rechnungsbezeichnung',
  'Datum',
  'Positionsinkrement',
  'Positionsbezeichnung',
  'Positionsbeschreibung',
  'Menge',
  'Einzelpreis(Brutto)',
  'Inkasso',
  'Zustellung',
  'Zahlungsziel',
  'Intervall',
  'Termin',
  'Fälligkeit',
  'Ende',
  'Mwst',
  'Rechnungsvermerk',
  'Spendenfähig',
  'Spendenart',
  'Buchhaltungskonto',
  'Steuerschlüssel',
  'Kostenstelle',
  'Auswertungskennziffer',
  'Nachlass',
  'Nachlassgrund',
  'Empfänger-Email',
  'Zusatzinformationen',
]

function escapeCsvField(value: string): string {
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function veranstaltungRechnungsimport(ctx: Context<{ Variables: AuthorizeResults }>) {
  const { query, gliederung } = ctx.var

  if (!query.veranstaltungId) {
    return ctx.text('veranstaltungId is required', 400)
  }

  const veranstaltung = await prisma.veranstaltung.findUnique({
    where: { id: query.veranstaltungId },
    select: {
      name: true,
      teilnahmegebuehr: true,
      unterveranstaltungen: {
        where: { gliederungId: gliederung?.id },
        select: {
          Anmeldung: {
            where: { status: 'BESTAETIGT' },
            select: {
              person: {
                select: {
                  email: true,
                },
              },
              customFieldValues: {
                select: {
                  value: true,
                  field: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!veranstaltung) {
    return ctx.text('Veranstaltung not found', 404)
  }

  const anmeldungenList = veranstaltung.unterveranstaltungen
    .flatMap((unterveranstaltung) => unterveranstaltung.Anmeldung)
    .sort((a, b) => a.person.email.localeCompare(b.person.email))

  const today = dayjs().format('DD.MM.YYYY')
  const faelligkeit = dayjs().add(14, 'day').format('DD.MM.YYYY')

  const rechnungsbezeichnung = veranstaltung.name.substring(0, 70)
  const positionsbezeichnung = `Teilnahmegebühr ${veranstaltung.name}`.substring(0, 70)
  const preis = veranstaltung.teilnahmegebuehr.toFixed(2).replace('.', ',')

  const rows = anmeldungenList.map((anmeldung) => {
    const mitgliedsnummerValue = anmeldung.customFieldValues.find(
      (cfv) => cfv.field.name.toLowerCase() === 'mitgliedsnummer'
    )?.value
    const mitgliedsnummer =
      typeof mitgliedsnummerValue === 'string'
        ? mitgliedsnummerValue
        : typeof mitgliedsnummerValue === 'number'
          ? String(mitgliedsnummerValue)
          : ''

    return [
      mitgliedsnummer,
      '2',
      '1',
      rechnungsbezeichnung,
      today,
      '1',
      positionsbezeichnung,
      '',
      '1',
      preis,
      '2',
      '2',
      '',
      '0',
      today,
      faelligkeit,
      '31.12.2099',
      '0',
      '',
      '0',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      anmeldung.person.email,
      '',
    ]
  })

  const csvLines = [COLUMNS.join(';'), ...rows.map((row) => row.map(escapeCsvField).join(';'))]

  const csvContent = '﻿' + csvLines.join('\r\n')
  const filename = `${dayjs().format('YYYYMMDD-HHmm')}-Rechnungsimport.csv`

  ctx.header('Content-Disposition', `attachment; filename="${filename}"`)
  ctx.header('Content-Type', 'text/csv; charset=utf-8')
  return ctx.body(csvContent, 200)
}
