import path from 'node:path'
import { fileURLToPath } from 'url'

import config from 'config'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseConfig = config.util.loadFileConfigs(path.join(__dirname, '..', 'config'))

const configSchema = z.strictObject({
  db: z.strictObject({
    url: z.string(),
  }),
  authentication: z.strictObject({
    secret: z.string(),
    expiresIn: z.string(),
  }),
  host: z.string(),
  port: z.number(),
  paginate: z.strictObject({
    default: z.number(),
    max: z.number(),
  }),
})

export default configSchema.parse(baseConfig)
