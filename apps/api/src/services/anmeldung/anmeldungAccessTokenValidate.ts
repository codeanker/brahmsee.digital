import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const anmeldungAccessTokenValidateProcedure = definePublicQueryProcedure({
  key: 'accessTokenValidate',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.string().uuid(),
    anmeldungId: z.string().uuid(),
    accessToken: z.string().uuid(),
  }),
  handler: ({ input: { unterveranstaltungId, anmeldungId, accessToken } }) => {
    return prisma.anmeldung.findFirst({
      where: {
        unterveranstaltungId,
        id: anmeldungId,
        accessToken,
      },
      select: {
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            photoId: true,
          },
        },
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
      },
    })
  },
})
