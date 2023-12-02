import path from 'path'
import { fileURLToPath } from 'url'

import { generateProcedureAction } from './generateProcedureAction'
import { generateProcedureCreate } from './generateProcedureCreate'
import { generateProcedureDelete } from './generateProcedureDelete'
import { generateProcedureGet } from './generateProcedureGet'
import { generateProcedureList } from './generateProcedureList'
import { generateProcedurePatch } from './generateProcedurePatch'
import { generateService } from './generateService'
// import commander from 'commander'
// import inquirer from 'inquirer'
export type GeneratorContext = {
  servicesDir: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiDir = path.join(__dirname, '../../../api')

const context: GeneratorContext = {
  servicesDir: path.join(apiDir, 'src/services'),
}

await generateService('test2', context)
await generateProcedureGet({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
await generateProcedureList({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
await generateProcedureCreate({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
await generateProcedurePatch({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
await generateProcedureDelete({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
await generateProcedureAction({ service: 'test2', usecase: 'testen', protection: 'public' }, context)
