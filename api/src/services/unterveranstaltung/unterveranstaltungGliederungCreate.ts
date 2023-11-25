import { TRPCError } from '@trpc/server'
import z from 'zod'

import { throwIfNotGliederungsadmin } from '../../helpers/throwIfNotGliederungsadmin'
import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZUnterveranstaltungGliederungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    veranstaltungId: z.number().int(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
    meldebeginn: z.date(),
    meldeschluss: z.date(),
    gliederungId: z.number().int(),
  }),
})

export type TUnterveranstaltungGliederungCreateInputSchema = z.infer<
  typeof ZUnterveranstaltungGliederungCreateInputSchema
>

type UnterveranstaltungGliederungCreateOptions = AuthenticatedContext & {
  input: TUnterveranstaltungGliederungCreateInputSchema
}

export async function unterveranstaltungGliederungCreate(options: UnterveranstaltungGliederungCreateOptions) {
  // check logged in user is admin of gliederung
  await throwIfNotGliederungsadmin({
    accountId: options.ctx.accountId,
    gliederungId: options.input.data.gliederungId,
  })
  const veranstaltung = await prisma.veranstaltung.findFirstOrThrow({
    where: {
      id: options.input.data.veranstaltungId,
    },
    select: {
      meldebeginn: true,
      meldeschluss: true,
    },
  })
  // check meldebegin is after parent meldebeginn
  if (new Date(options.input.data.meldebeginn) < veranstaltung.meldebeginn) {
    throw new TRPCError({
      message: 'meldebeginn',
      code: 'BAD_REQUEST',
    })
  }
  // check meldeschluss is before parent meldeschluss
  if (new Date(options.input.data.meldeschluss) > veranstaltung.meldeschluss) {
    throw new TRPCError({
      message: 'meldeschluss',
      code: 'BAD_REQUEST',
    })
  }
  return prisma.unterveranstaltung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
