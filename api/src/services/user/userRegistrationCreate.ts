import { Gender, Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'

export const ZUserRegistrationCreateInputSchema = z.strictObject({
  data: z.strictObject({
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string(),
    birthdate: z.string().nullable(),
    gender: z.nativeEnum(Gender).nullable(),
  }),
})

export type TUserRegistrationCreateInputSchema = z.infer<typeof ZUserRegistrationCreateInputSchema>

type UserRegistrationCreateOptions = {
  input: TUserRegistrationCreateInputSchema
}

export async function userRegistrationCreate(options: UserRegistrationCreateOptions) {
  const data: Prisma.UserCreateInput = {
    ...options.input.data,
    role: 'ADMIN', // @todo: no admin on registration!
  }
  return prisma.user.create({
    data,
    select: {
      id: true,
    },
  })
}
