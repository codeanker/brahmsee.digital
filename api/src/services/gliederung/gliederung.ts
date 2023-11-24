import { router, protectedProcedure } from '../../trpc'

import { gliederungManagementCreate, ZGliederungManagementCreateInputSchema } from './gliederungManagementCreate'
import { ZGliederungManagementGetInputSchema, gliederungManagementGet } from './gliederungManagementGet'
import { ZGliederungManagementListInputSchema, gliederungManagementList } from './gliederungManagementList'

export const gliederungRouter = router({
  managementCreate: protectedProcedure(['ADMIN'])
    .input(ZGliederungManagementCreateInputSchema)
    .mutation(gliederungManagementCreate),
  managementList: protectedProcedure(['ADMIN'])
    .input(ZGliederungManagementListInputSchema)
    .query(gliederungManagementList),
  // [additional routes]
  managementGet: protectedProcedure(['ADMIN'])
    .input(ZGliederungManagementGetInputSchema)
    .query(gliederungManagementGet),
})
