import { createLogger, format, transports } from 'winston'

import config from './config'

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} >> ${message}`
})

export const logger = createLogger({
  level: config.loggingLevel,
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
