import { z } from 'zod'

export const sheetQuerySchema = z
  .object({
    jwt: z.string(),
    veranstaltungId: z.string().uuid().optional(),
    unterveranstaltungId: z.string().uuid().optional(),
  })
  .refine((data) => !!data.veranstaltungId || !!data.unterveranstaltungId, {
    message: 'Exactly one of veranstaltungId or unterveranstaltungId must be provided',
  })

export type SheetQuery = z.infer<typeof sheetQuerySchema>
