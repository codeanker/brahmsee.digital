import { Role } from '@prisma/client'
import z from 'zod'

import type { Context } from '../../context.js'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const ZGliederungVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    edv: z.string(),
  }),
})

export type TGliederungVerwaltungCreateInputSchema = z.infer<typeof ZGliederungVerwaltungCreateInputSchema>

type GliederungVerwaltungCreateOptions = Context & {
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

export const gliederungVerwaltungCreateProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungCreate',
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
