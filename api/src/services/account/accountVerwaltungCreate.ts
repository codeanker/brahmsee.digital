import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'

import { hashPassword } from '@codeanker/authentication'

export const ZAccountVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    password: z.string(),
    email: z.string().email(),
    roleId: z.nativeEnum(Role),
    isActiv: z.boolean().optional(),
    adminInGliederungId: z.number().int().optional(),
  }),
})

export type TAccountVerwaltungCreateInputSchema = z.infer<typeof ZAccountVerwaltungCreateInputSchema>

type AccountVerwaltungCreateOptions = {
  input: TAccountVerwaltungCreateInputSchema
}

export async function accountVerwaltungCreate(options: AccountVerwaltungCreateOptions) {
  return prisma.account.create({
    data: {
      email: options.input.data.email,
      password: await hashPassword(options.input.data.password),
      role: options.input.data.roleId,
      person: {
        create: {
          firstname: options.input.data.firstname,
          lastname: options.input.data.lastname,
        },
      },
      activatedAt: options.input.data.isActiv ? new Date() : null,
      GliederungToAccount:
        options.input.data.adminInGliederungId !== undefined
          ? {
              create: {
                gliederungId: options.input.data.adminInGliederungId,
                role: 'DELIGATIONSLEITER',
              },
            }
          : undefined,
    },
    select: {
      id: true,
    },
  })
}
