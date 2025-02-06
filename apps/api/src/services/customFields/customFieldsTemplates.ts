import { Role } from '@prisma/client'
import { z } from 'zod'

import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import templates from './schema/templates.js'

export const customFieldsTemplates = defineProtectedQueryProcedure({
  key: 'listTemplates',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.void(),
  handler: () => templates,
})
