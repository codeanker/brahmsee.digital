import { z, type ZodError, type ZodSchema } from 'zod'

type ZodSafeResult<O> = [true, O] | [false, ZodError<O>]

/**
 * Runs a zod schema validation and returns the result data as a tuple.
 * @param schema - The zod schema to use for validation
 * @param payload - The payload to validate
 * @returns A tuple where the first element indicates success (true) or failure (false),
 *          and the second element contains either the validated data or the ZodError
 * @example
 * const [success, result] = await zodSafe(mySchema, data)
 * if (success) {
 *   // result is the validated data
 * } else {
 *   // result is a ZodError
 * }
 */
export async function zodSafe<I, O>(schema: ZodSchema<O>, payload: I): Promise<ZodSafeResult<O>> {
  const { success, data, error } = await schema.safeParseAsync(payload)

  if (success) {
    return [true, data]
  }

  return [false, error]
}

/**
 * A Zod schema that transforms string 'true'/'false' values to actual booleans.
 * Useful for parsing query parameters or environment variables.
 * @example
 * boolish.parse('true') // true
 * boolish.parse('false') // false
 */
export const boolish = z.enum(['true', 'false']).transform((v) => v === 'true')

export const zEmptyStringAsUndefined = (v: string | undefined) => {
  const trimmed = v?.trim()
  if (trimmed === undefined || trimmed.length === 0) {
    return undefined
  }
  return trimmed
}
