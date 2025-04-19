// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { anmeldungLinkCreateProcedure } from './anmeldeLink.create.js'
import { anmeldungLinkCountProcedure, anmeldungLinkListProcedure } from './anmeldeLink.list.js'
import { anmeldungLinkAuthorizeProcedure } from './anmeldeLink.validate.js'

// Import Routes here - do not delete this line

export const anmeldungLinkRouter = mergeRouters(
  anmeldungLinkCountProcedure,
  anmeldungLinkListProcedure,
  anmeldungLinkAuthorizeProcedure,
  anmeldungLinkCreateProcedure
)

// Add Routes here - do not delete this line
