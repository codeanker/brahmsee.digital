import { ActivityType } from '@prisma/client'

import { logger } from '../logger.js'
import prisma from '../prisma.js'

interface Opts {
  type: ActivityType
  description?: string
  causerId?: string
  metadata?: unknown
  subjectType: string
  subjectId?: string
}

export default async function logActivity(opts: Opts) {
  try {
    await prisma.activity.create({
      data: {
        ...opts,
        subjectId: opts.subjectId,
        metadata: opts.metadata ?? {},
      },
    })
  } catch (error) {
    logger.warn('Failed to insert activity record!', error)
  }
}
