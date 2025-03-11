import z from 'zod'

import prisma from '../../prisma.js'

import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { TRPCError } from '@trpc/server'
import type { Prisma } from '@prisma/client'

export const anmeldungFotoUploadProcedure = definePublicMutateProcedure({
  key: 'anmeldungFotoUpload',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
    anmeldungId: z.number().int(),
    accessToken: z.string().uuid(),
    fileId: z.string(),
  }),
  handler: async ({ input: { unterveranstaltungId, anmeldungId, accessToken, fileId } }) => {
    const unterveranstaltung = await prisma.unterveranstaltung.findFirst({
      where: {
        id: unterveranstaltungId,
        meldeschluss: {
          gt: new Date(),
        },
      },
    })
    if (unterveranstaltung === null) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Der Meldeschluss ist bereits erreicht!',
      })
    }

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
