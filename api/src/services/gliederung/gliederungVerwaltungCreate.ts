import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import type { AuthenticatedContext } from '../../trpc.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

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

export const gliederungVerwaltungCreateProcedure = defineProtectedProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  roleIds: [Role.ADMIN],
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
