import { ActivityType } from '@prisma/client'

import { logger } from '../logger'
import prisma from '../prisma'

interface Opts {
  type: ActivityType
  description?: string
  causerId?: number
  metadata?: any
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
  } catch (error: any) {
    logger.warn('Failed to insert activity record!', error)
  }
}
