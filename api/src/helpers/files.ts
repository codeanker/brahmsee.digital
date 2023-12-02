import { access, constants, lstat, readdir } from 'fs/promises'
import path from 'path'

async function isDirectory(source: string) {
  return (await lstat(source)).isDirectory()
}

export async function getDirectories(source: string) {
  return readdir(source).then((files) => files.filter((file) => isDirectory(path.join(source, file))))
}
export function checkFileExists(file) {
  return access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
