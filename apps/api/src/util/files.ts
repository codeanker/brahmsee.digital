import type { PathLike } from 'fs'
import { access, constants, lstat, readdir } from 'fs/promises'
import path from 'path'

/**
 * Checks if a given path is a directory.
 * @param source - The path to check
 * @returns True if the path is a directory, false otherwise
 * @internal
 */
async function isDirectory(source: string) {
  return (await lstat(source)).isDirectory()
}

/**
 * Gets all subdirectories within a given directory.
 * @param source - The path to the parent directory
 * @returns An array of directory names (not full paths)
 * @example
 * await getDirectories('/home/user/projects') // ['project1', 'project2']
 */
export async function getDirectories(source: string) {
  const files = await readdir(source)
  const dirs = await Promise.all(
    files.map(async (file) => {
      const filePath = path.resolve(source, file)
      return (await isDirectory(filePath)) ? file : null
    })
  )
  return dirs.filter((dir) => dir !== null)
}

/**
 * Checks if a file or directory exists at the given path.
 * @param file - The path to check
 * @returns A promise that resolves to true if the file exists, false otherwise
 * @example
 * await checkFileExists('/path/to/file.txt') // true or false
 */
export function checkFileExists(file: PathLike) {
  return access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
