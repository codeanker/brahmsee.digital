import { Role } from '@prisma/client'
import { z } from 'zod'

import { hashPassword } from '@codeanker/authentication'

export const accountSchema = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  email: z.string().email(),
  roleId: z.nativeEnum(Role),
  isActiv: z.boolean().optional(),
  adminInGliederungId: z.number().int().optional(),
})

export async function getAccountCreateData(data: z.infer<typeof accountSchema>) {
  return {
    email: data.email,
    password: await hashPassword(data.password),
    role: data.roleId,
    person: {
      create: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
    },
    activatedAt: data.isActiv ? new Date() : null,
    GliederungToAccount:
      data.adminInGliederungId !== undefined
        ? {
            create: {
              gliederungId: data.adminInGliederungId,
              role: 'DELIGATIONSLEITER' as const,
            },
          }
        : undefined,
  }
}
