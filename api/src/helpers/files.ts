import { access, constants, lstat, readdir } from 'fs/promises'
import path from 'path'

async function isDirectory(source: string) {
  return (await lstat(source)).isDirectory()
}

export async function getDirectories(source: string) {
  const files = await readdir(source)
  const dirs = await Promise.all(
    files.map(async (file) => {
      const filePath = path.resolve(source, file)
      return (await isDirectory(filePath)) ? file : null
    })
  )
  return dirs.filter((dir) => dir !== null) as string[]
}
export function checkFileExists(file) {
  return access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
