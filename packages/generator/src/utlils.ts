import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export type ProcedureOptions = {
  service: string
  usecase: string
  protection: 'restrictToRoleIds' | 'public'
}

type ProcedureType = 'get' | 'create' | 'patch' | 'delete' | 'list' | 'action'

export function applyInserts(contentLines: string[], inserts: { placeholder: string; insert: string }[]) {
  const newContentLines = [...contentLines]
  for (const replacement of inserts) {
    const index = newContentLines.findIndex((line) => line.includes(replacement.placeholder))
    newContentLines.splice(index, 0, replacement.insert)
  }
  return newContentLines
}

export function deleteLine(contentLines: string[], line: string) {
  const index = contentLines.findIndex((curLine) => curLine.includes(line))
  contentLines.splice(index, 1)
  return contentLines
}

export function getProtectionContent(protection: ProcedureOptions['protection']) {
  switch (protection) {
    case 'public':
      return "{ type: 'public' }"
    case 'restrictToRoleIds':
      return "{ type: 'restrictToRoleIds', roleIds: ['ADMIN'] }"
  }
}

export function toPascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getProcedureFileName(procedure: ProcedureOptions, procedureType: ProcedureType) {
  const useCasePascalCase = toPascalCase(procedure.usecase)
  return `${procedure.service}${useCasePascalCase}${toPascalCase(procedureType)}`
}

export async function addProcedureToRouter(
  procedure: ProcedureOptions,
  sericeDir: string,
  procedureType: ProcedureType
) {
  const routerPath = path.join(sericeDir, `${procedure.service}.router.ts`)
  const procedureFileName = getProcedureFileName(procedure, procedureType)

  const inserts = [
    {
      placeholder: '// Import Routes here - do not delete this line',
      insert: `import { ${procedureFileName}Procedure } from './${procedureFileName}'`,
    },
    {
      placeholder: '// Add Routes here - do not delete this line',
      insert: `  ${procedureFileName}Procedure.router,`,
    },
  ]
  // register in router
  const routerContent = await readFile(routerPath, 'utf-8')
  const lines = routerContent.split('\n')
  const replacedContent = applyInserts(lines, inserts)

  await writeFile(routerPath, replacedContent.join('\n'))
}

export async function addListProcedureToRouter(
  procedure: ProcedureOptions,
  sericeDir: string,
  procedureType: ProcedureType
) {
  const routerPath = path.join(sericeDir, `${procedure.service}.router.ts`)
  const procedureFileName = getProcedureFileName(procedure, procedureType)

  const inserts = [
    {
      placeholder: '// Import Routes here - do not delete this line',
      insert: `import { ${procedureFileName}Procedure, ${procedureFileName}CountProcedure } from './${procedureFileName}'`,
    },
    {
      placeholder: '// Add Routes here - do not delete this line',
      insert: `  ${procedureFileName}Procedure.router,
  ${procedureFileName}CountProcedure.router,`,
    },
  ]
  // register in router
  const routerContent = await readFile(routerPath, 'utf-8')
  const lines = routerContent.split('\n')
  const replacedContent = applyInserts(lines, inserts)

  await writeFile(routerPath, replacedContent.join('\n'))
}
