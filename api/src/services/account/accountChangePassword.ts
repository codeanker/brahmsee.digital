import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { hashPassword, passwordMatches } from '@codeanker/authentication'
import { isStrongPassword } from '@codeanker/helpers'

export const accountChangePasswordProcedure = defineProcedure({
  key: 'changePassword',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
    password_old: z.string(),
    password: z.string(),
    password_confirm: z.string(),
  }),
  async handler(options) {
    const { password } = await prisma.account.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        password: true,
      },
    })

    if (options.ctx.accountId === options.input.id && !(await passwordMatches(password, options.input.password_old))) {
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

    if (!isStrongPassword(options.input.password)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Password must fulfill the security requirements!',
      })
    }

    await prisma.account.update({
      where: {
        id: options.input.id,
      },
      data: {
        password: await hashPassword(options.input.password),
      },
    })
  },
})
