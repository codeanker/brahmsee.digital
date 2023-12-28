/**
 * Checks whether all properties of an object are undefined.
 *
 * @returns {boolean}
 */
export function isAllUndefined(obj: object): boolean {
  return Object.keys(obj)
    .map((k) => obj[k] === undefined)
    .reduce((p, c) => p && c)
}
