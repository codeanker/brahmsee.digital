import { ActivityType } from '@prisma/client'

import prisma from '../prisma'

interface Opts {
  type: ActivityType
  description: string
  causerId?: number
  metadata?: any
  subjectType: string
  subjectId: number
}

export default async function logActivity(opts: Opts) {
  try {
    await prisma.activity.create({
      data: {
        type: opts.type,
        description: opts.description,
        causerId: opts.causerId ?? undefined,
        metadata: opts.metadata ?? {},
        subjectType: opts.subjectType,
        subjectId: opts.subjectId,
      },
    })
  } catch (error) {
    // ¯\_(ツ)_/¯
  }
}
