import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from 'config'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseConfig = config.util.loadFileConfigs(path.join(__dirname, '..', 'config'))

const configSchema = z.strictObject({
  authentication: z.strictObject({
    secret: z.string(),
    expiresIn: z.string(),
    microsoft: z.strictObject({
      tenantId: z.string(),
      client_id: z.string(),
      secret: z.string(),
    }),
  }),
  redis: z.strictObject({
    host: z.string(),
  }),
  host: z.string(),
  port: z.number(),
  clientUrl: z.string().url(),
  paginate: z.strictObject({
    default: z.number(),
    max: z.number(),
  }),
  'aws-s3': z.strictObject({
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    folder: z.string(),
    bucket: z.string(),
  }),
})

export default configSchema.parse(baseConfig)
