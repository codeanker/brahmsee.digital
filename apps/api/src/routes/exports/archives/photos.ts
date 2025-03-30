import archiver from 'archiver'
import type { Context } from 'koa'
import mime from 'mime'
import { randomUUID } from 'node:crypto'
import prisma from '../../../prisma.js'
import { openFileStream } from '../../../services/file/helpers/getFileUrl.js'
import { sheetAuthorize } from '../sheets/sheets.schema.js'

export async function veranstaltungPhotoArchive(ctx: Context) {
  const authorization = await sheetAuthorize(ctx)
  if (!authorization) {
    return
  }

  const { query, gliederung } = authorization

  const anmeldungen = await prisma.anmeldung.findMany({
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
          veranstaltung: {
            select: {
              name: true,
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
          firstname: true,
          lastname: true,
          photo: true,
        },
      },
    },
  })

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
  ctx.res.setHeader('Content-Disposition', `attachment; filename="photos-${randomUUID()}.zip"`)
  zip.pipe(ctx.res)

  for (const { person, unterveranstaltung } of anmeldungen) {
    if (!person.photo) {
      return
    }

    const stream = await openFileStream(person.photo)

    const directory = `Fotos Teilnehmende ${unterveranstaltung.veranstaltung.name}/${unterveranstaltung.gliederung.name}`
    const name = `${person.firstname} ${person.lastname}.${mime.getExtension(person.photo.mimetype ?? 'text/plain')}`
    zip.append(stream, {
      name: `${directory}/${name}`,
      date: person.photo.createdAt,
    })
  }

  await zip.finalize()

  ctx.res.end()
}
