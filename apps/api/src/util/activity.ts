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

/**
 * Logs an activity to the database for audit trail purposes.
 * This function creates an activity record that tracks user actions and system events.
 * If the logging fails, it logs a warning but doesn't throw an error to prevent disrupting the main flow.
 * @param opts - The activity options
 * @param opts.type - The type of activity (from ActivityType enum)
 * @param opts.description - Optional description of the activity
 * @param opts.causerId - Optional ID of the user/account who caused the activity
 * @param opts.metadata - Optional metadata object with additional information
 * @param opts.subjectType - The type of the subject entity (e.g., 'User', 'Event')
 * @param opts.subjectId - Optional ID of the subject entity
 * @example
 * await logActivity({
 *   type: ActivityType.CREATE,
 *   description: 'Created new event',
 *   causerId: '123',
 *   subjectType: 'Event',
 *   subjectId: '456'
 * })
 */
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
