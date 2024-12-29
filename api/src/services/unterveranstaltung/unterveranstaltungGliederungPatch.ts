import type { UUID } from 'crypto'

import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

export const unterveranstaltungGliederungPatchProcedure = defineProcedure({
  key: 'gliederungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      maxTeilnehmende: z.number().int().optional(),
      teilnahmegebuehr: z.number({ description: 'In Cent' }).int().optional(),
      meldebeginn: z.date().optional(),
      meldeschluss: z.date().optional(),
      beschreibung: z.string().optional(),
      bedingungen: z.string().optional(),
      addDocuments: z
        .array(
          z.strictObject({
            name: z.string(),
            fileId: z.string().uuid(),
          })
        )
        .optional(),
      updateDocuments: z.array(z.strictObject({ id: z.number().int(), name: z.string() })).optional(),
      deleteDocumentIds: z.array(z.number().int()).optional(),
    }),
  }),
  async handler(options) {
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

    // Documents create, update, delete
    const documents: {
      createMany?: { data: { name: string; fileId: UUID }[] }
      updateMany?: { where: { id: number }; data: { name: string } }[]
      deleteMany?: { id: number }[]
    } = {}
    if (options.input.data.addDocuments) {
      documents.createMany = {
        data: options.input.data.addDocuments.map((doc) => ({ ...doc, fileId: doc.fileId as UUID })),
      }
    }
    if (options.input.data.updateDocuments) {
      documents.updateMany = options.input.data.updateDocuments.map((doc) => ({
        where: { id: doc.id },
        data: { name: doc.name },
      }))
    }
    if (options.input.data.deleteDocumentIds) {
      documents.deleteMany = options.input.data.deleteDocumentIds.map((id) => ({ id }))
    }

    return prisma.unterveranstaltung.update({
      where: {
        id: options.input.id,
        gliederungId: gliederung.id,
      },
      data: {
        maxTeilnehmende: options.input.data.maxTeilnehmende,
        teilnahmegebuehr: options.input.data.teilnahmegebuehr,
        meldebeginn: options.input.data.meldebeginn,
        meldeschluss: options.input.data.meldeschluss,
        beschreibung: options.input.data.beschreibung,
        bedingungen: options.input.data.bedingungen,
        documents: documents,
      },
      select: {
        id: true,
      },
    })
  },
})
