import { dayjs } from '@codeanker/helpers'
import XLSX from '@e965/xlsx'
import type { Gliederung } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import archiver from 'archiver'
import type { Context } from 'koa'
import mime from 'mime'
import { z } from 'zod'
import prisma from '../../../prisma.js'
import { openFileStream } from '../../../services/file/helpers/getFileUrl.js'
import { getSecurityWorksheet } from '../helpers/getSecurityWorksheet.js'
import { sheetAuthorize, type SheetQuery } from '../sheets/sheets.schema.js'

const querySchema = z.object({
  mode: z.enum(['group', 'flat']),
})

function queryAnmeldungen(query: SheetQuery, gliederung?: Gliederung) {
  return prisma.anmeldung.findMany({
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
      person: {
        photoId: {
          not: null,
        },
      },
    },
    select: {
      id: true,
      unterveranstaltung: {
        select: {
          beschreibung: true,
          veranstaltung: {
            select: {
              name: true,
              beginn: true,
            },
          },
          gliederung: {
            select: {
              name: true,
            },
          },
        },
      },
      person: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          photo: true,
          birthday: true,
          essgewohnheit: true,
        },
      },
    },
  })
}

function buildSheet(
  anmeldungen: Awaited<ReturnType<typeof queryAnmeldungen>>,
  person: { firstname: string; lastname: string }
) {
  const rows = anmeldungen.map((anmeldung) => {
    const age = dayjs(anmeldung.unterveranstaltung.veranstaltung.beginn).diff(anmeldung.person.birthday, 'years')
    const extension = mime.getExtension(anmeldung.person.photo?.mimetype ?? 'text/plain')
    return {
      Fotomarker: anmeldung.person.photo ? `Fotos/${anmeldung.person.photo.id}.${extension}` : '',
      Altersmarker: age < 16 ? 'U16' : age < 18 ? 'U18' : '',
      Veggiemarker: anmeldung.person.essgewohnheit === 'OMNIVOR' ? '' : 'brocolli.svg',
      Vorname: anmeldung.person.firstname,
      Nachname: anmeldung.person.lastname,
      Ausschreibung:
        anmeldung.unterveranstaltung.beschreibung?.substring(0, 30) || anmeldung.unterveranstaltung.gliederung.name,
    }
  })

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(rows)

  XLSX.utils.book_append_sheet(workbook, worksheet, `Teilnehmendenliste`)

  /** add Security Worksheet */
  const { securityWorksheet, securityWorksheetName } = getSecurityWorksheet({ person }, rows.length)
  XLSX.utils.book_append_sheet(workbook, securityWorksheet, securityWorksheetName)

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

export async function veranstaltungPhotoArchive(ctx: Context) {
  const authorization = await sheetAuthorize(ctx)
  if (!authorization) {
    return
  }

  const { query, gliederung, account } = authorization
  const { mode } = querySchema.parse(ctx.query)

  if (mode === 'flat' && account.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
    })
  }

  const anmeldungen = await queryAnmeldungen(query, gliederung)

  const zip = archiver('zip')

  zip.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err)
    } else {
      throw err
    }
  })

  // good practice to catch this error explicitly
  zip.on('error', function (err) {
    throw err
  })

  ctx.res.statusCode = 201
  ctx.res.setHeader('Content-Type', 'application/zip')
  ctx.res.setHeader(
    'Content-Disposition',
    `attachment; filename="${mode === 'flat' ? 'FotosForAutomation' : 'Fotos'}.zip"`
  )
  zip.pipe(ctx.res)

  for (const { person, unterveranstaltung } of anmeldungen) {
    if (!person.photo) {
      return
    }

    const stream = await openFileStream(person.photo)

    const directory = `Fotos Teilnehmende ${unterveranstaltung.veranstaltung.name}/${unterveranstaltung.gliederung.name}`
    const basename = mode === 'group' ? `${person.firstname} ${person.lastname}` : person.id
    const extension = mime.getExtension(person.photo.mimetype ?? 'text/plain')

    zip.append(stream, {
      name: mode === 'group' ? `${directory}/${basename}.${extension}` : `Fotos/${person.photo.id}.${extension}`,
      date: person.photo.createdAt,
    })
  }

  if (mode === 'flat') {
    const buffer = buildSheet(anmeldungen, account.person)
    zip.append(buffer, {
      name: 'Datenzusammenführung.xlsx',
    })
  }

  await zip.finalize()

  ctx.res.end()
}
