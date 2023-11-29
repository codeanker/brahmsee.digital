import z from 'zod'

import prisma from '../../prisma'

import { accountSchema, getAccountCreateData } from './schema/account.schema'

export const ZAccountVerwaltungCreateInputSchema = z.strictObject({
  data: accountSchema,
})

export type TAccountVerwaltungCreateInputSchema = z.infer<typeof ZAccountVerwaltungCreateInputSchema>

type AccountVerwaltungCreateOptions = {
  input: TAccountVerwaltungCreateInputSchema
}

export async function accountVerwaltungCreate(options: AccountVerwaltungCreateOptions) {
  return prisma.account.create({
    data: await getAccountCreateData(options.input.data),
    select: {
      id: true,
    },
  })
}
