import { QualificationErsteHilfe } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const QualificationErsteHilfeMapping = defineEnumMapping<QualificationErsteHilfe>({
  EINWEISER_EHSH: { human: 'Einweiser EHSH' },
  AUSBILDER_EHSH_MODUL_1_2: { human: 'Ausbilder EHSH Modul 1 und 2' },
  AUSBILDER_EHSH_MODUL_3: { human: 'Ausbilder EHSH Modul 3' },
  AUSBILDER: { human: 'Ausbilder' },
  AUSBILDUNG: { human: 'Ausbildung' },
  BILDUNGS_UND_BETREUUNGSEINRICHTUNGEN_KINDER: { human: 'Bildungs- und Betreuungseinrichtungen für Kinder' },
  KINDERNOTFAELLE: { human: 'Kindernotfälle' },
  MODULE_1: { human: 'Modul 1' },
  MODULE_2: { human: 'Modul 2' },
  MODULE_3: { human: 'Modul 3' },
})
