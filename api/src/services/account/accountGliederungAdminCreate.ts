import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

import { accountVerwaltungCreate } from './accountVerwaltungCreate'

export const ZAccountGliederungAdminCreateInputSchema = z.strictObject({
  data: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    password: z.string(),
    email: z.string().email(),
    gliederungId: z.number().int(),
  }),
})

export type TAccountGliederungAdminCreateInputSchema = z.infer<typeof ZAccountGliederungAdminCreateInputSchema>

type AccountGliederungAdminCreateOptions = AuthenticatedContext & {
  input: TAccountGliederungAdminCreateInputSchema
}

export async function accountGliederungAdminCreate(options: AccountGliederungAdminCreateOptions) {
  const gliederung = await prisma.gliederung.findUniqueOrThrow({
    where: {
      id: options.input.data.gliederungId,
    },
    select: {
      id: true,
      adminIds: true,
    },
  })
  if (gliederung.adminIds !== null && gliederung.adminIds.length > 0) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Gliederung hat bereits einen Admin',
    })
  }
  return accountVerwaltungCreate({
    input: {
      data: {
        firstname: options.input.data.firstname,
        lastname: options.input.data.lastname,
        password: options.input.data.password,
        email: options.input.data.email,
        roleId: 'GLIEDERUNG_ADMIN',
        isActiv: true,
        adminInGliederungId: options.input.data.gliederungId,
      },
    },
  })
}
