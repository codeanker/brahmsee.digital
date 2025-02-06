export function pascalToCamelCase(str: string) {
  if (str.length === 0 || !str[0]) return str
  return str[0].toLowerCase() + str.slice(1)
}

export function toPascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
