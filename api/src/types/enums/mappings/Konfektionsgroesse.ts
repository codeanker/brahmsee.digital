import { Konfektionsgroesse } from '@prisma/client'

import { defineEnumMapping } from "../defineEnumMapping.js"

export const KonfektionsgroesseMapping = defineEnumMapping<Konfektionsgroesse>({
  JUNIOR_98_104: { human: 'Junior 98/104' },
  JUNIOR_110_116: { human: 'Junior 110/116' },
  JUNIOR_122_128: { human: 'Junior 122/128' },
  JUNIOR_134_140: { human: 'Junior 134/140' },
  JUNIOR_146_152: { human: 'Junior 146/152' },
  JUNIOR_158_164: { human: 'Junior 158/164' },
  XS: { human: 'XS' },
  S: { human: 'S' },
  M: { human: 'M' },
  L: { human: 'L' },
  XL: { human: 'XL' },
  XXL: { human: 'XXL' },
  XXXL: { human: 'XXXL' },
})
