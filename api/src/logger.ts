import { createLogger, format, transports } from 'winston'

import { isDevelopment } from './util/is-production'

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} >> ${message}`
})

export const logger = createLogger({
  level: isDevelopment() ? 'debug' : 'info',
  format: format.combine(
    format.label({
      label: 'main',
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.colorize(),
    myFormat
  ),
  transports: [new transports.Console()],
})
