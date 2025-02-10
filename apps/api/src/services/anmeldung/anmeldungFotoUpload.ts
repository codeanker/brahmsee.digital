import z from 'zod'

import prisma from '../../prisma.js'

import { definePublicMutateProcedure } from '../../types/defineProcedure.js'

export const anmeldungFotoUploadProcedure = definePublicMutateProcedure({
  key: 'anmeldungFotoUpload',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
    anmeldungId: z.number().int(),
    accessToken: z.string().uuid(),
    fileId: z.string(),
  }),
  handler: async ({ input: { unterveranstaltungId, anmeldungId, accessToken, fileId } }) => {
    await prisma.anmeldung.update({
      where: {
        unterveranstaltungId,
        id: anmeldungId,
        accessToken,
      },
      data: {
        accessToken: null,
        person: {
          update: {
            photoId: fileId,
          },
        },
      },
    })
  },
})
