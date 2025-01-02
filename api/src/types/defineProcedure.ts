import type { Role } from '@prisma/client'
import type { z } from 'zod'

import { protectedProcedure, publicProcedure, router, type AuthenticatedContext } from '../trpc.js'

export type MaybePromise<TType> = Promise<TType> | TType

export function defineProtectedProcedure<
  const TProcedureKey extends string,
  TInputSchema extends z.ZodSchema,
  TProcedureResult,
>(config: {
  /** Der Key unter dem der Endpunkt aufgerufen werden kann */
  key: TProcedureKey
  /** Die trpc Methode. 'query' um Daten zu lesen und 'mutation' wenn Daten geändert werden */
  method: 'query' | 'mutation'
  /** Das Schema der Eingabedaten */
  inputSchema: TInputSchema
  /** Der Handler der die Daten verarbeitet */
  handler: (options: {
    ctx: AuthenticatedContext['ctx']
    input: z.infer<TInputSchema>
  }) => MaybePromise<TProcedureResult>
  /** roles */
  roleIds: Role[]
}) {
  const procedure = protectedProcedure(config.roleIds)
    .input(config.inputSchema)
    [config.method]((opts) => config.handler(opts))
  return {
    router: router({
      [config.key]: procedure,
    } as { [k in TProcedureKey]: typeof procedure }),
  }
}

export function definePublicProcedure<
  const TProcedureKey extends string,
  TInputSchema extends z.ZodSchema,
  TProcedureResult,
>(config: {
  /** Der Key unter dem der Endpunkt aufgerufen werden kann */
  key: TProcedureKey
  /** Die trpc Methode. 'query' um Daten zu lesen und 'mutation' wenn Daten geändert werden */
  method: 'query' | 'mutation'
  /** Das Schema der Eingabedaten */
  inputSchema: TInputSchema
  /** Der Handler der die Daten verarbeitet */
  handler: (options: {
    ctx: { accountId: number | undefined }
    input: z.infer<TInputSchema>
  }) => MaybePromise<TProcedureResult>
}) {
  const procedure = publicProcedure.input(config.inputSchema)[config.method]((opts) => config.handler(opts))
  return {
    router: router({
      [config.key]: procedure,
    } as { [k in TProcedureKey]: typeof procedure }),
  }
}
