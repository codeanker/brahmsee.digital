import { TRPCError } from '@trpc/server'
import { v7 as uuidV7 } from 'uuid'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { sendMail } from '../../util/mail.js'
import config from '../../config.js'

export const requestGliederungAccessCreateProcedure = defineProtectedMutateProcedure({
  key: 'requestGliederungAdminCreate',
  roleIds: ['USER'],
  inputSchema: z.strictObject({
    gliederungId: z.string().uuid(),
  }),
  handler: async ({ ctx, input }) => {
    const existing = await prisma.gliederungToAccount.findFirst({
      where: {
        accountId: ctx.accountId,
        gliederungId: input.gliederungId,
        confirmedByGliederung: false,
      },
    })
    if (existing !== null) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Es gibt bereits eine ausstehende Anfrage für diese Gliederung.',
      })
    }

    const gliederung = await prisma.gliederung.findUniqueOrThrow({
      where: {
        id: input.gliederungId,
      },
      select: {
        name: true,
        domain: true,
      },
    })

    if (!gliederung.domain) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Die Gliederung ${gliederung.name} hat keine Domain hinterlegt!`,
      })
    }

    const confirmByGliederungToken = uuidV7()

    await prisma.$transaction(async (tx) => {
      await tx.gliederungToAccount.create({
        data: {
          createdAt: new Date(),
          gliederungId: input.gliederungId,
          accountId: ctx.accountId,
          role: 'DELEGATIONSLEITER',
          confirmedByGliederung: false,
          confirmByGliederungToken,
        },
      })

      await sendMail({
        to: `info@${gliederung.domain}`,
        subject: 'Zugriffsanfrage auf deine Gliederung',
        template: 'gliederung-access-request-info',
        categories: ['access', 'gliederung'],
        variables: {
          hostname: 'brahmsee.digital',
          gliederung: gliederung.name,
          name: gliederung.name,
          veranstaltung: 'Zugriffsanfrage',
          confirmLink: `${config.clientUrl}/confirm/gliederung-access/${confirmByGliederungToken}`,
        },
      })
    })
  },
})
