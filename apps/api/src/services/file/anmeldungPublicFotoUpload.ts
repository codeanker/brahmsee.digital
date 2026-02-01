import { z } from 'zod'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { fileCreateSchema, handleFileUpload } from './fileCreate.js'
import prisma from '../../prisma.js'
import { TRPCError } from '@trpc/server'

export const anmeldungPublicFotoUploadProcedure = definePublicMutateProcedure({
  key: 'anmeldungPublicFotoUpload',
  inputSchema: fileCreateSchema.extend({
    unterveranstaltungId: z.string().uuid(),
    anmeldungId: z.string().uuid(),
    accessToken: z.string().uuid(),
  }),
  handler: async ({ input: { unterveranstaltungId, anmeldungId, accessToken, mimetype } }) => {
    const anmeldung = await prisma.anmeldung.findFirst({
      where: {
        unterveranstaltungId,
        id: anmeldungId,
        accessToken,
      },
    })

    if (anmeldung === null) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }

    return await handleFileUpload({ mimetype })
  },
})
