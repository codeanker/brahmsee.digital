import path from 'node:path'
import { fileURLToPath } from 'url'

import config from 'config'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseConfig = config.util.loadFileConfigs(path.join(__dirname, '..', 'config'))

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
    expiresIn: z.string(),
    dlrg: z.strictObject({
      client_id: z.string(),
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
})

export default configSchema.parse(baseConfig)
