import { router, protectedProcedure } from '../../trpc'

import { gliederungManagementCreate, ZGliederungManagementCreateInputSchema } from './gliederungManagementCreate'
import { ZGliederungManagementListInputSchema, gliederungManagementList } from './gliederungManagementList'

export const gliederungRouter = router({
  managementCreate: protectedProcedure(['ADMIN'])
    .input(ZGliederungManagementCreateInputSchema)
    .mutation(gliederungManagementCreate),
  managementList: protectedProcedure(['ADMIN'])
    .input(ZGliederungManagementListInputSchema)
    .query(gliederungManagementList),
  // [additional routes]
})
