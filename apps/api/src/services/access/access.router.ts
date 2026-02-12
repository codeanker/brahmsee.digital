import { mergeRouters } from '../../trpc.js'
import { requestGliederungAccessCreateProcedure } from './access.requestGliederungCreate.js'
import { requestGliederungAdminDecideProcedure } from './access.requestGliederungPatch.js'
import { requestGliederungAccessValidateProcedure } from './access.requestGliederungValidate.js'
import { listAllGliederungAdminRequestsProcedure } from './access.requestListAll.js'
import { listOwnGliederungAdminRequestsProcedure } from './access.requestListOwn.js'

export const accessRouter = mergeRouters(
  listOwnGliederungAdminRequestsProcedure,
  listAllGliederungAdminRequestsProcedure,
  requestGliederungAccessCreateProcedure,
  requestGliederungAdminDecideProcedure,
  requestGliederungAccessValidateProcedure
)
