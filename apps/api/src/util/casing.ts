/**
 * Converts a PascalCase string to camelCase.
 * @param str - The PascalCase string to convert
 * @returns The string in camelCase format
 * @example
 * pascalToCamelCase('HelloWorld') // 'helloWorld'
 * pascalToCamelCase('') // ''
 */
export function pascalToCamelCase(str: string) {
  if (str.length === 0 || !str[0]) return str
  return str[0].toLowerCase() + str.slice(1)
}

/**
 * Converts the first character of a string to uppercase (converts to PascalCase).
 * @param str - The string to convert
 * @returns The string with the first character in uppercase
 * @example
 * toPascalCase('helloWorld') // 'HelloWorld'
 * toPascalCase('foo') // 'Foo'
 */
export function toPascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
