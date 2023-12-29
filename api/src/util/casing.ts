export function pascalToCamelCase(str: string) {
  return str[0].toLowerCase() + str.slice(1)
}

export function toPascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
