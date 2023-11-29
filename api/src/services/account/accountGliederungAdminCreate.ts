import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

import { accountSchema, getAccountCreateData } from './schema/account.schema'

export const ZAccountGliederungAdminCreateInputSchema = z.strictObject({
  data: accountSchema.omit({ roleId: true, isActiv: true }),
})

export type TAccountGliederungAdminCreateInputSchema = z.infer<typeof ZAccountGliederungAdminCreateInputSchema>

type AccountGliederungAdminCreateOptions = AuthenticatedContext & {
  input: TAccountGliederungAdminCreateInputSchema
}

export async function accountGliederungAdminCreate(options: AccountGliederungAdminCreateOptions) {
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
      roleId: 'GLIEDERUNG_ADMIN',
      isActiv: false,
      adminInGliederungId: options.input.data.adminInGliederungId,
    }),
    select: {
      id: true,
    },
  })
}
