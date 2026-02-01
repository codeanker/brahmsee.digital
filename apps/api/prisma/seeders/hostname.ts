import type { PrismaClient } from '@prisma/client'
import type { Seeder } from './index.js'
import logActivity from '../../src/util/activity.js'

const importHostnames: Seeder = async (prisma: PrismaClient) => {
  await prisma.hostname.createMany({
    data: [{ hostname: 'brahmsee.digital' }, { hostname: 'landes.digital' }],
  })

  await logActivity({
    type: 'CREATE',
    subjectType: 'hostname',
    description: 'hostname list created via db seeder',
  })
}

export { importHostnames }
