import { AnmeldungStatus } from '@prisma/client'
import dayjs from 'dayjs'
import type { Context } from 'hono'
import PDFDocument from 'pdfkit'
import prisma from '../../prisma.js'
import type { AuthorizeResults } from './middleware/authorize.js'

// T-shirt sizes in order
const TSHIRT_SIZES = [
  'JUNIOR_98_104',
  'JUNIOR_110_116',
  'JUNIOR_122_128',
  'JUNIOR_134_140',
  'JUNIOR_146_152',
  'JUNIOR_158_164',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
]

// Mapping for display names
const SIZE_DISPLAY_NAMES: Record<string, string> = {
  JUNIOR_98_104: 'Junior 98-104',
  JUNIOR_110_116: 'Junior 110-116',
  JUNIOR_122_128: 'Junior 122-128',
  JUNIOR_134_140: 'Junior 134-140',
  JUNIOR_146_152: 'Junior 146-152',
  JUNIOR_158_164: 'Junior 158-164',
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
  XXXL: 'XXXL',
}

export async function veranstaltungTShirtListe(ctx: Context<{ Variables: AuthorizeResults }>) {
  const { query, gliederung } = ctx.var
  const hinweisText = ctx.req.query('hinweis') || ''

  // Get all Gliederungen for the Veranstaltung or Unterveranstaltung
  const unterveranstaltungen = await prisma.unterveranstaltung.findMany({
    where: {
      OR: [{ id: query.unterveranstaltungId }, { veranstaltungId: query.veranstaltungId }],
      ...(gliederung ? { gliederungId: gliederung.id } : {}),
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
      veranstaltung: {
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
          id: true,
          customFieldValues: {
            where: {
              field: {
                name: 'Konfektionsgröße',
              },
            },
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
  })

  // Group by Gliederung and aggregate T-shirt sizes
  const gliederungMap = new Map<string, { name: string; sizes: Map<string, number>; nachbestellungen: number }>()

  for (const uv of unterveranstaltungen) {
    const gliederungId = uv.gliederung.id
    const gliederungName = uv.gliederung.name

    if (!gliederungMap.has(gliederungId)) {
      gliederungMap.set(gliederungId, {
        name: gliederungName,
        sizes: new Map(),
        nachbestellungen: 0,
      })
    }

    const gliederungData = gliederungMap.get(gliederungId)!

    for (const anmeldung of uv.Anmeldung) {
      for (const customFieldValue of anmeldung.customFieldValues) {
        const sizeValue = customFieldValue.value as string
        if (sizeValue && TSHIRT_SIZES.includes(sizeValue)) {
          const currentCount = gliederungData.sizes.get(sizeValue) || 0
          gliederungData.sizes.set(sizeValue, currentCount + 1)
        }
      }
    }
  }

  // Generate PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const buffers: Buffer[] = []

  doc.on('data', buffers.push.bind(buffers))

  let isFirstPage = true

  for (const [, data] of gliederungMap) {
    // Add page break if not first page
    if (!isFirstPage) {
      doc.addPage()
    }
    isFirstPage = false

    // Title
    doc.fontSize(20).text('T-Shirt Liste', { align: 'center' })
    doc.moveDown()

    // Gliederung name
    doc.fontSize(16).text(`Gliederung: ${data.name}`, { underline: true })
    doc.moveDown()

    // Table header
    doc.fontSize(12).text('Größe', 100, doc.y, { continued: true, width: 200 })
    doc.text('Anzahl', { align: 'right', width: 300 })
    doc.moveDown(0.5)

    // Draw line
    doc
      .moveTo(100, doc.y)
      .lineTo(500, doc.y)
      .stroke()
    doc.moveDown(0.5)

    // Table rows
    let totalCount = 0
    for (const size of TSHIRT_SIZES) {
      const count = data.sizes.get(size) || 0
      totalCount += count
      const displayName = SIZE_DISPLAY_NAMES[size] || size

      doc.fontSize(11).text(displayName, 100, doc.y, { continued: true, width: 200 })
      doc.text(count.toString(), { align: 'right', width: 300 })
      doc.moveDown(0.3)
    }

    // Draw line
    doc.moveDown(0.2)
    doc
      .moveTo(100, doc.y)
      .lineTo(500, doc.y)
      .stroke()
    doc.moveDown(0.5)

    // Total
    doc.fontSize(12).font('Helvetica-Bold').text('Gesamt', 100, doc.y, { continued: true, width: 200 })
    doc.text(totalCount.toString(), { align: 'right', width: 300 })
    doc.font('Helvetica')
    doc.moveDown()

    // Nachbestellungen
    doc.fontSize(11).text(`Anzahl nachbestellter T-Shirts: ${data.nachbestellungen}`)
    doc.moveDown()

    // Hinweis
    if (hinweisText) {
      doc.moveDown()
      doc.fontSize(10).fillColor('#666666').text('Hinweis:', { underline: true })
      doc.fontSize(9).text(hinweisText, { align: 'left' })
      doc.fillColor('#000000')
      doc.moveDown()
    }

    // Checkbox
    doc.moveDown(2)
    doc.fontSize(11).text('☐  Abgeholt / Kontrolliert', 100, doc.y)
    doc.moveDown()

    // Footer with date
    doc.fontSize(8).fillColor('#999999').text(`Erstellt am: ${dayjs().format('DD.MM.YYYY HH:mm')}`, 100, doc.y, {
      align: 'left',
    })
    doc.fillColor('#000000')
  }

  doc.end()

  return new Promise<Response>((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers)
      const filename = `${dayjs().format('YYYYMMDD-HHmm')}-TShirt-Liste.pdf`

      const response = new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })

      resolve(response)
    })
  })
}
