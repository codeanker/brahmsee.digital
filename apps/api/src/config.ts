import path from 'node:path'
import { fileURLToPath } from 'url'

import type { StringValue } from '@codeanker/authentication'
import { FileProvider } from '@prisma/client'
import config from 'config'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseConfig = config.util.loadFileConfigs(path.join(__dirname, '..', 'config')) as object

const zMsUnit = z
  .string()
  .regex(
    /^\d+\s?\w*$/g,
    'Value must be a valid duration as specified by vercel/ms: https://github.com/vercel/ms?tab=readme-ov-file#examples'
  )
  .transform((arg) => arg as StringValue)

export const configSchema = z.strictObject({
  clientUrl: z.string(),

  server: z.strictObject({
    host: z.string(),
    port: z.number(),
  }),

  db: z.strictObject({
    url: z.string(),
  }),

  authentication: z.strictObject({
    secret: z.string(),
    expiresIn: zMsUnit,
    dlrg: z.strictObject({
      issuer: z.string().url(),
      clientId: z.string(),
      clientSecret: z.string().optional(),
      allowInsecure: z.boolean(),
    }),
  }),

  mail: z.strictObject({
    sendMails: z.union([z.literal('true'), z.literal('false')]),
    sendgridApiKey: z.string(),
  }),

  paginate: z.strictObject({
    default: z.number(),
    max: z.number(),
  }),
  loggingLevel: z.string(),
  meilisearch: z.strictObject({
    host: z.string(),
    apiKey: z.string(),
  }),
  fileDefaultProvider: z.nativeEnum(FileProvider),
  fileProviders: z.strictObject({
    LOCAL: z.strictObject({
      path: z.string(),
    }),
    AZURE: z.strictObject({
      account: z.string(),
      accountKey: z.string(),
      container: z.string(),
      folder: z.string(),
    }),
  }),

  tomtom: z.strictObject({
    apiKey: z.string(),
  }),
  public: z.strictObject({
    legal: z.strictObject({
      imprint: z.string().url(),
      privacy: z.string().url(),
    }),
  }),

  export: z.strictObject({
    sheetPassword: z.string().optional(),
  }),
})

export default configSchema.parse(baseConfig)
