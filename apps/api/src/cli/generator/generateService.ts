import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

import { checkFileExists } from '../../util/files.js'

import { applyInserts, type GeneratorContext } from './utlils.js'

export async function generateService(name: string, context: GeneratorContext) {
  const sericeDir = path.join(context.servicesDir, name)

  const servicePath = path.join(sericeDir, `${name}.router.ts`)
  const content = `// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

// Import Routes here - do not delete this line

export const ${name}Router = mergeRouters(
  // Add Routes here - do not delete this line
)
`

  await mkdir(sericeDir, { recursive: true })
  const alreadyExists = await checkFileExists(servicePath)
  if (alreadyExists) {
    throw new Error(`Service ${name} already exists`)
  }
  await writeFile(servicePath, content)

  const inserts = [
    {
      placeholder: '// Add Routers here - do not delete this line',
      insert: `  ${name}: ${name}Router,`,
    },
    {
      placeholder: '// Add Imports here - do not delete this line',
      insert: `import { ${name}Router } from './${name}/${name}.router'`,
    },
  ]
  const indexPath = path.join(context.servicesDir, 'index.ts')
  const currentContent = await readFile(indexPath, 'utf-8')
  const newContent = applyInserts(currentContent.split('\n'), inserts).join('\n')
  await writeFile(indexPath, newContent)
}
