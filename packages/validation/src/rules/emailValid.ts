const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')
const errorMessage = 'Die Email hat nicht das korrekte Format'

/**
 * Validates that a value is a properly formatted email address.
 * Checks for valid email format and ensures no spaces are present.
 * @param value - The value to validate
 * @returns True if the value is a valid email, or an error message in German if invalid
 * @example
 * emailValid('user@example.com') // true
 * emailValid('invalid email') // 'Die Email hat nicht das korrekte Format'
 */
export function emailValid(value: unknown) {
  if (typeof value !== 'string') return errorMessage
  const emailValid = emailRegex.test(value) && !value.includes(' ')
  if (emailValid) {
    return true
  }
  return 'Die Email hat nicht das korrekte Format'
}
