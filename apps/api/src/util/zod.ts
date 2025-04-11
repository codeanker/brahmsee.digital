import type { ZodError, ZodSchema } from 'zod'

type ZodSafeResult<O> = [true, O] | [false, ZodError<O>]

/**
 * Runs a zod schema validation and returns the result data as a tuple.
 *
 * @param schema The zod schema to use for validation.
 * @param payload The payload to validate.
 * @returns The validation result.
 */
export async function zodSafe<I, O>(schema: ZodSchema<O>, payload: I): Promise<ZodSafeResult<O>> {
  const { success, data, error } = await schema.safeParseAsync(payload)

  if (success) {
    return [true, data]
  }

  return [false, error]
}
