import * as csv from 'fast-csv'
import { Role } from '@prisma/client'
import { getEntityIdFromHeader } from '../../authentication.js'
import prisma from '../../prisma.js'
import { makeApp } from '../../util/make-app.js'
import { ReadStream } from 'node:fs'
import { createAnmeldung } from './anmeldungen.js'

const importRouter = makeApp()

importRouter.post('/anmeldungen/:unterveranstaltungId', async (ctx) => {
  const authorization = ctx.req.header('Authorization')
  if (!authorization) {
    ctx.status(401)
    return
  }

  const accountId = getEntityIdFromHeader(authorization)
  if (!accountId) {
    ctx.status(401)
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
  if (!account || account.role !== Role.ADMIN) {
    ctx.status(401)
    return
  }

  const body = await ctx.req.parseBody({
    all: true,
  })

  const files = Object.values(body).filter((v) => v instanceof File)
  for (const file of files) {
    if (file.type !== 'text/csv') {
      return ctx.json({ message: 'Datei muss vom Typ CSV sein' }, 400)
    }
  }

  const unterveranstaltung = await findUnterveranstaltung(parseInt(ctx.req.param('unterveranstaltungId')))
  if (!unterveranstaltung) {
    return ctx.json({ error: 'Unterveranstaltung not found' }, 404)
  }

  for (const file of files) {
    const parser = csv.parse({ headers: true, delimiter: ';', ignoreEmpty: true })
    await new Promise<number>((resolve, reject) => {
      ReadStream.fromWeb(file.stream())
        .pipe(parser)
        .on('error', reject)
        .on('data', (row: unknown) => {
          // TODO: push rows to a cache and flush it afterwards (redis for example)
          void createAnmeldung(row, unterveranstaltung)
        })
        .on('end', resolve)
    })
  }
})

export { importRouter }

/**
 * Suche nach der passenden Unterveranstaltung anhand der ID
 * @param unterveranstaltungId
 * @returns
 */
async function findUnterveranstaltung(unterveranstaltungId: number) {
  return await prisma.unterveranstaltung.findUnique({
    where: {
      id: unterveranstaltungId,
    },
    select: {
      id: true,
      gliederungId: true,
    },
  })
}
