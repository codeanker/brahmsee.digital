import { z } from 'zod'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import prisma from '../../prisma.js'

export const createAccessForGliederungProcedure = defineProtectedMutateProcedure({
  key: 'createForGliederung',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    accountId: z.string().uuid(),
    gliederungId: z.string().uuid(),
  }),
  handler: async ({ ctx, input }) => {
    await prisma.$transaction(async (tx) => {
      const record = await tx.gliederungToAccount.create({
        data: {
          createdAt: new Date(),
          confirmedAt: new Date(),
          confirmedByGliederung: true,
          role: 'DELEGATIONSLEITER',
          gliederungId: input.gliederungId,
          accountId: input.accountId,
        },
        select: {
          id: true,
          account: {
            select: {
              email: true,
              person: {
                select: {
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
          gliederung: {
            select: {
              name: true,
            },
          },
        },
      })
      await tx.account.update({
        where: {
          id: input.accountId,
        },
        data: {
          role: 'GLIEDERUNG_ADMIN',
        },
      })

      const description = `
      Der Account von ${record.account.person.firstname} ${record.account.person.lastname} (${record.account.email}) hat
      jetzt Zugriff auf die Gliederung ${record.gliederung.name}
      `
      await tx.activity.create({
        data: {
          type: 'CREATE',
          subjectType: 'gliederungtoaccount',
          subjectId: `${record.id}`,
          causerId: ctx.accountId,
          createdAt: new Date(),
          description,
        },
      })
    })
  },
})
