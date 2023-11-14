import { Gender } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma'
import { publicProcedure, router } from '../../trpc'
import exclude from '../../util/prisma-exclude'
import { hashPassword } from '../authentication'

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        role: z.enum(['GLIEDERUNG_ADMIN', 'ADMIN']),
        password: z.string(),
        birthdate: z.string().nullable(),
        gender: z.nativeEnum(Gender).nullable(),
      })
    )
    .mutation(async (opts) => {
      const users = await prisma.user.create({
        data: {
          email: opts.input.email,
          firstname: opts.input.firstname,
          lastname: opts.input.lastname,
          role: opts.input.role,
          password: await hashPassword(opts.input.password),
          gender: opts.input.gender as Gender,
          birthday: opts.input.birthdate,
        },
        select: {
          id: true,
        },
      })
      return users
    }),
  /** Die Liste der User */
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
      },
    })
    return users
  }),

  read: publicProcedure.input(z.number().int()).query(async ({ input }) => {
    const user = await prisma.user.findFirst({
      where: {
        id: input,
      },
    })
    if (user !== null) {
      return exclude(user, 'password')
    }

    return null
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
        email: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        birthdate: z.string().nullable(),
        gender: z.nativeEnum(Gender).nullable(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          email: input.email,
          firstname: input.firstname,
          lastname: input.lastname,
          gender: input.gender as Gender,
          birthday: input.birthdate,
        },
      })
    }),

  delete: publicProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await prisma.user.delete({
      where: {
        id: input,
      },
    })
  }),
})
