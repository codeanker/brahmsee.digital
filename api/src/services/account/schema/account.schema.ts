import { Gender, Role, AccountStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import config from '../../.././config'
import { sendMail } from '../../../util/mail'

import { hashPassword } from '@codeanker/authentication'

export const accountSchema = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  birthday: z.date(),
  gender: z.nativeEnum(Gender),
  password: z.string(),
  email: z.string().email(),
  roleId: z.nativeEnum(Role),
  isActiv: z.boolean().optional(),
  status: z.nativeEnum(AccountStatus).optional(),
  adminInGliederungId: z.number().int().optional(),
  activationToken: z.string().optional(),
  passwordResetToken: z.string().optional(),
})

export type TAccountSchema = z.infer<typeof accountSchema>

const ZGetAccountCreateDataSchema = accountSchema.extend({
  password: z.string().optional(), // optional, because oauth login does not have a password
})

type TGetAccountCreateDataSchema = z.infer<typeof ZGetAccountCreateDataSchema>

export async function getAccountCreateData(data: TGetAccountCreateDataSchema) {
  return {
    email: data.email,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    password: data.password ? await hashPassword(data.password) : undefined,
    role: data.roleId,
    person: {
      create: {
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        birthday: data.birthday,
        email: data.email,
        telefon: '',
      },
    },
    activatedAt: data.isActiv ? new Date() : null,
    GliederungToAccount:
      data.adminInGliederungId !== undefined
        ? {
            create: {
              gliederungId: data.adminInGliederungId,
              role: 'DELEGATIONSLEITER' as const,
            },
          }
        : undefined,
    activationToken: uuidv4(),
  }
}

export async function sendMailConfirmEmailRequest(data: { email: string; activationToken: string }) {
  const activationUrl = `${config.clientUrl}/registrierung/confirm/${data.activationToken}`
  sendMail({
    to: data.email,
    subject: 'brahmsee.digital Bestätige deine E-Mail Adresse',
    categories: ['account', 'confirm'],
    html: `Bitte bestätige deine E-Mail Adresse, indem du auf folgenden Link klickst: <a href="${activationUrl}">${activationUrl}</a>`,
  })
}
