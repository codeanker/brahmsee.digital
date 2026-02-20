import { stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, normalize, resolve } from 'node:path'
import slug from 'slug'

export const routerBaseDir = resolve('src/routes')

export async function processFile(file: string) {
  const name = basename(file, '.vue')
  const dir = dirname(file)
  const routeFile = join(dir, `${name}.route.ts`)

  if (!dir.startsWith(routerBaseDir) || !file.endsWith('.vue')) {
    return
  }

  try {
    const stats = await stat(routeFile)
    if (!stats.isFile()) {
      throw new Error(`${routeFile} is not a file`)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    const href = dir.replace(routerBaseDir, '')
    await writeFile(
      routeFile,
      `
      import { createRoute } from '@kitbag/router'
      import component from './${name}.vue'

      export const ${name}Route = createRoute({
        component,
        name: '${name}',
        path: '${normalize(`/${href}/${slug(name)}`)}',
      })
      `
        .split('\n')
        .map((it) => it.trim())
        .join('\n')
    )
  }
}

/** @returns {import('vite').Plugin} */
export function kitbagRouterPlugin() {
  return {
    name: 'router-gen',
    watchChange: async (id) => {
      await processFile(id)
    },
    configResolved: async (options) => {
      for await (const file of glob(`${routerBaseDir}/**/*.vue`, { cwd: options.root })) {
        await processFile(file)
      }
    },
  }
}
