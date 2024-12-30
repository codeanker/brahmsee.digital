import { Role } from '@prisma/client'
import z from 'zod'

import prisma from "../../prisma.js"
import type { AuthenticatedContext } from "../../trpc.js"
import { defineProcedure } from "../../types/defineProcedure.js"

export const ZGliederungVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    edv: z.string(),
  }),
})

export type TGliederungVerwaltungCreateInputSchema = z.infer<typeof ZGliederungVerwaltungCreateInputSchema>

type GliederungVerwaltungCreateOptions = AuthenticatedContext & {
  input: TGliederungVerwaltungCreateInputSchema
}

export async function gliederungVerwaltungCreate(options: GliederungVerwaltungCreateOptions) {
  return prisma.gliederung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}

export const gliederungVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      name: z.string(),
      edv: z.string(),
    }),
  }),
  async handler(options) {
    return prisma.gliederung.create({
      data: options.input.data,
      select: {
        id: true,
      },
    })
  },
})
