import { z } from 'zod'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { fileCreateSchema, handleFileUpload } from './fileCreate.js'
import client from '../../prisma.js'
import { TRPCError } from '@trpc/server'

export const anmeldungPublicFotoUploadProcedure = definePublicMutateProcedure({
  key: 'anmeldungPublicFotoUpload',
  inputSchema: fileCreateSchema.extend({
    unterveranstaltungId: z.number().int(),
    anmeldungId: z.number().int(),
    accessToken: z.string().uuid(),
  }),
  handler: async ({ input: { unterveranstaltungId, anmeldungId, accessToken, mimetype } }) => {
    const anmeldung = await client.anmeldung.findFirst({
      where: {
        unterveranstaltungId,
        id: anmeldungId,
        accessToken,
      },
      select: {
        unterveranstaltung: {
          select: {
            veranstaltung: {
              select: {
                name: true,
                settings: {
                  select: {
                    enablePhotoUpload: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (anmeldung === null) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }
    if (!anmeldung.unterveranstaltung.veranstaltung.settings?.enablePhotoUpload) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Für die Veranstaltung ${anmeldung.unterveranstaltung.veranstaltung.name} werden keine Fotos benötigt.`,
      })
    }

    return await handleFileUpload({ mimetype })
  },
})
