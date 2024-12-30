import { ActivityType } from '@prisma/client'

import { logger } from "../logger.js"
import prisma from "../prisma.js"

interface Opts {
  type: ActivityType
  description?: string
  causerId?: number
  metadata?: unknown
  subjectType: string
  subjectId?: number
}

export default async function logActivity(opts: Opts) {
  try {
    await prisma.activity.create({
      data: {
        ...opts,
        metadata: opts.metadata ?? {},
      },
    })
  } catch (error) {
    logger.warn('Failed to insert activity record!', error)
  }
}
