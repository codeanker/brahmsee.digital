import type { Prisma } from '@prisma/client'

type CustomField = Prisma.CustomFieldCreateInput

const customFieldKonfektionsgroesse: CustomField = {
  name: 'Konfektionsgröße',
  type: 'BASIC_DROPDOWN',
  description: 'Gib hier deine gewünschte T-Shirt Größe an. Es gelten Standardmaße.',
  options: [
    'JUNIOR_98_104',
    'JUNIOR_110_116',
    'JUNIOR_122_128',
    'JUNIOR_134_140',
    'JUNIOR_146_152',
    'JUNIOR_158_164',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'XXXL',
  ],
}

const customFieldFahrerlaubnis: CustomField = {
  name: 'Fahrerlaubnis',
  type: 'BASIC_DROPDOWN',
  description: 'Wenn du einen Führerschein hast, gib hier bitte deine Fahrerlaubnisklasse an.',
  options: ['B', 'BE', 'C', 'CE', 'D1', 'D', 'D1E', 'DE', 'T', 'L'],
}

const customFieldSchwimmabzeichen: CustomField = {
  name: 'Schwimmabzeichen',
  type: 'BASIC_DROPDOWN',
  description: 'Gib hier bitte dein aktuellstes Schwimmabzeichen an.',
  options: ['DSA Bronze', 'DSA Silber', 'DSA Gold', 'Juniorretter', 'DRSA Bronze', 'DRSA Silber', 'DRSA Gold'],
}

const customFieldFunk: CustomField = {
  name: 'Funkausbildung',
  type: 'BASIC_SELECT',
  options: [
    'DLRG_SPRECHFUNKER',
    'BOS_SPRECHFUNKER_ANALOG',
    'BOS_SPRECHFUNKER_DIGITAL',
    'AUSBILDER_SPRECHFUNK',
    'AUSBILDER_BOS_SPRECHFUNK',
    'MULTIPLIKATOR_SPRECHFUNK',
    'MULTIPLIKATOR_BOS_SPRECHFUNK',
    'EINSATZFAEHIGKEIT',
  ],
}

const customFieldErsteHilfeAusbildung: CustomField = {
  name: 'Erste Hilfe Ausbildung',
  type: 'BASIC_SELECT',
  options: [
    'EINWEISER_EHSH',
    'AUSBILDER_EHSH_MODUL_1_2',
    'AUSBILDER_EHSH_MODUL_3',
    'MODULE_1',
    'MODULE_2',
    'MODULE_3',
    'AUSBILDUNG',
    'KINDERNOTFAELLE',
    'BILDUNGS_UND_BETREUUNGSEINRICHTUNGEN_KINDER',
    'AUSBILDER',
  ],
}

const customFieldSanAusbildung: CustomField = {
  name: 'Sanitätsausbildung',
  type: 'BASIC_SELECT',
  options: ['SAN_A', 'SAN_B', 'FORTBILDUNG', 'AUSBILDER'],
}

const templates: Record<string, CustomField> = [
  customFieldKonfektionsgroesse,
  customFieldFahrerlaubnis,
  customFieldSchwimmabzeichen,
  customFieldFunk,
  customFieldErsteHilfeAusbildung,
  customFieldSanAusbildung,
].reduce((prev, curr) => ({ ...prev, [curr.name]: curr }), {})

export default templates
