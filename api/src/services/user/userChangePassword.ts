import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import prisma from '../../prisma'

import { hashPassword, passwordMatches } from '@codeanker/authentication'

export const ZUserChangePasswordInputSchema = z.strictObject({
  id: z.number().int(),
  password_old: z.string(),
  password: z.string(),
  password_confirm: z.string(),
})

export type TUserChangePasswordInputSchema = z.infer<typeof ZUserChangePasswordInputSchema>

type UserChangePasswordOptions = {
  input: TUserChangePasswordInputSchema
}

export async function userChangePassword(options: UserChangePasswordOptions) {
  const { password } = await prisma.user.findFirstOrThrow({
    where: {
      id: options.input.id,
    },
    select: {
      password: true,
    },
  })
  if (!(await passwordMatches(password, options.input.password_old))) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must enter your old password to change it!',
    })
  }

  if (options.input.password !== options.input.password_confirm) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Password must be confirmed and match!',
    })
  }

  await prisma.user.update({
    where: {
      id: options.input.id,
    },
    data: {
      password: await hashPassword(options.input.password),
    },
  })
}
