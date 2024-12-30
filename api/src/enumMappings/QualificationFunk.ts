import { QualificationFunk } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping.js'

export const QualificationFunkMapping = defineEnumMapping<QualificationFunk>({
  AUSBILDER_BOS_SPRECHFUNK: { human: 'Ausbilder BOS Sprechfunk' },
  AUSBILDER_SPRECHFUNK: { human: 'Ausbilder Sprechfunk' },
  BOS_SPRECHFUNKER_ANALOG: { human: 'BOS Sprechfunker analog' },
  BOS_SPRECHFUNKER_DIGITAL: { human: 'BOS Sprechfunker digital' },
  DLRG_SPRECHFUNKER: { human: 'DLRG Sprechfunker' },
  EINSATZFAEHIGKEIT: { human: 'Einsatzfähigkeit' },
  MULTIPLIKATOR_BOS_SPRECHFUNK: { human: 'Multiplikator BOS Sprechfunk' },
  MULTIPLIKATOR_SPRECHFUNK: { human: 'Multiplikator Sprechfunk' },
})
