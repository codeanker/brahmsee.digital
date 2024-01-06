import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { accountSchema, getAccountCreateData } from './schema/account.schema'

export const accountGliederungAdminCreateProcedure = defineProcedure({
  key: 'gliederungAdminCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: accountSchema.omit({ roleId: true, isActiv: true }),
  }),
  async handler(options) {
    const gliederung = await prisma.gliederung.findUniqueOrThrow({
      where: {
        id: options.input.data.adminInGliederungId,
      },
      select: {
        id: true,
        GliederungToAccount: {
          select: {
            accountId: true,
            role: true,
          },
        },
      },
    })
    if (gliederung.GliederungToAccount.filter((relation) => relation.role === 'DELIGATIONSLEITER').length > 0) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Gliederung hat bereits einen Admin',
      })
    }
    await prisma.account.create({
      data: await getAccountCreateData({
        email: options.input.data.email,
        firstname: options.input.data.firstname,
        lastname: options.input.data.lastname,
        password: options.input.data.password,
        birthday: options.input.data.birthday,
        gender: options.input.data.gender,
        roleId: 'GLIEDERUNG_ADMIN',
        isActiv: false,
        adminInGliederungId: options.input.data.adminInGliederungId,
      }),
      select: {
        id: true,
      },
    })
  },
})
