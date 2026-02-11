const levels: ((password: string) => boolean)[] = [
  (p) => p.length >= 8,
  (p) => /[a-z]/.test(p),
  (p) => /[A-Z]/.test(p),
  (p) => /[0-9]/.test(p),
  (p) => /[^A-Za-z0-9]/.test(p),
]

const requiredPasswordLevel = levels.length

/**
 * Computes the password strength level based on various criteria.
 * The password is tested against multiple criteria:
 * - At least 8 characters long
 * - Contains lowercase letters
 * - Contains uppercase letters
 * - Contains numbers
 * - Contains special characters
 * @param password - The password string to evaluate
 * @returns A number from 0 to 5 indicating the password strength level
 * @example
 * computePasswordLevel('weak') // 1 (only length criteria met)
 * computePasswordLevel('Strong123!') // 5 (all criteria met)
 */
export function computePasswordLevel(password: string) {
  let level = 0

  for (const tester of levels) {
    if (!tester(password)) {
      break
    }

    level++
  }

  return level
}

/**
 * Checks if a password meets all strength requirements.
 * A password is considered strong if it meets all 5 criteria:
 * length >= 8, lowercase, uppercase, numbers, and special characters.
 * @param password - The password string to validate
 * @returns True if the password meets all strength requirements, false otherwise
 * @example
 * isStrongPassword('weak') // false
 * isStrongPassword('Strong123!') // true
 */
export function isStrongPassword(password: string) {
  return computePasswordLevel(password) === requiredPasswordLevel
}

export { requiredPasswordLevel }
