import { createLogger, format, transports } from 'winston'

import config from './config'

const myFormat = format.printf(({ level, message, label, timestamp, metadata }) => {
  const base = `${timestamp} [${label}] ${level} >> ${message}`
  if (Object.keys(metadata).length === 0) {
    return base
  }

  return `${base}\n${JSON.stringify(metadata, null, 4).replaceAll(/"*/g, '')}`
})

export const logger = createLogger({
  level: config.loggingLevel,
  format: format.combine(
    format.label({
      label: 'main',
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.colorize(),
    format.metadata({
      fillExcept: ['timestamp', 'label', 'level', 'message'],
    }),
    myFormat
  ),
  transports: [new transports.Console()],
})
