import type { Role } from '@prisma/client'
import type { BuildProcedure, CreateRouterInner, ProcedureBuilder, ProcedureParams } from '@trpc/server'
import type { z } from 'zod'

import { protectedProcedure, publicProcedure, router } from '../trpc'

type GetProcedureConfig<TProcedure extends ProcedureBuilder<any>> = TProcedure extends ProcedureBuilder<infer T>
  ? T
  : never

type ProtectedProcedureConfig = GetProcedureConfig<ReturnType<typeof protectedProcedure>>
type PublicProcedureConfig = GetProcedureConfig<typeof publicProcedure>

type ProcedureResult<
  TProcedureConfig extends ProcedureParams,
  TMethod extends 'query' | 'mutation',
  TTnput,
  TResult,
> = BuildProcedure<
  TMethod,
  {
    _config: TProcedureConfig['_config']
    _ctx_out: TProcedureConfig['_ctx_out']
    _input_in: TTnput
    _input_out: TTnput
    _output_in: TProcedureConfig['_output_in']
    _output_out: TResult
    _meta: TProcedureConfig['_meta']
  },
  TResult
>

type RootRouterConfig = ReturnType<typeof router> extends CreateRouterInner<infer T, any> ? T : never

export function defineProcedure<
  const TProcedureKey extends string,
  TMethod extends 'query' | 'mutation',
  TInputSchema extends z.ZodSchema,
  TResult,
  TProtection extends { type: 'public' } | { type: 'restrictToRoleIds'; roleIds: Role[] },
  THandler extends (options: {
    input: z.infer<TInputSchema>
    ctx: TProtection extends { type: 'public' }
      ? PublicProcedureConfig['_ctx_out']
      : ProtectedProcedureConfig['_ctx_out']
  }) => Promise<TResult>,
  TProcedureResult extends ProcedureResult<
    TProtection extends { type: 'public' } ? PublicProcedureConfig : ProtectedProcedureConfig,
    TMethod,
    z.infer<TInputSchema>,
    ReturnType<THandler>
  >,
  TProcedureRouter extends CreateRouterInner<
    RootRouterConfig,
    {
      [TKey in TProcedureKey]: TProcedureResult
    }
  >,
>(config: {
  /** Der Key unter dem der Endpunkt aufgerufen werden kann */
  key: TProcedureKey
  /** Die trpc Methode. 'query' um Daten zu lesen und 'mutation' wenn Daten geändert werden */
  method: TMethod
  /** Die Protection Art des Endpunktes */
  protection: TProtection
  /** Das Schema der Eingabedaten */
  inputSchema: TInputSchema
  /** Der Handler der die Daten verarbeitet */
  handler: THandler
}) {
  const procedure =
    config.protection.type === 'public' ? publicProcedure : protectedProcedure(config.protection.roleIds)
  return {
    ...config,
    router: router({
      [config.key]: procedure
        .input(config.inputSchema)
        [config.method](config.handler as any) as unknown as TProcedureResult,
    }) as TProcedureRouter,
  }
}
