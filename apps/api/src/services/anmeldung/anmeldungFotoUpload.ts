import z from 'zod'

import prisma from '../../prisma.js'

import type { Prisma } from '@prisma/client'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'

export const anmeldungFotoUploadProcedure = definePublicMutateProcedure({
  key: 'anmeldungFotoUpload',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.string().uuid(),
    anmeldungId: z.string().uuid(),
    accessToken: z.string().uuid(),
    fileId: z.string(),
  }),
  handler: async ({ input: { unterveranstaltungId, anmeldungId, accessToken, fileId } }) => {
    const where: Prisma.AnmeldungWhereUniqueInput = {
      unterveranstaltungId,
      id: anmeldungId,
      accessToken,
    }
    const anmeldung = await prisma.anmeldung.findUniqueOrThrow({
      where,
      select: {
        person: {
          select: {
            photoId: true,
          },
        },
      },
    })
    if (anmeldung.person.photoId !== null) {
      // TODO: Delete old file
    }

    await prisma.anmeldung.update({
      where,
      data: {
        person: {
          update: {
            photoId: fileId,
          },
        },
      },
    })
  },
})
