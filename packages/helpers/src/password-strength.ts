const levels: ((password: string) => boolean)[] = [
  (p) => p.length >= 8,
  (p) => /[a-z]/.test(p),
  (p) => /[A-Z]/.test(p),
  (p) => /[0-9]/.test(p),
  (p) => /[^A-Za-z0-9]/.test(p),
]

const requiredPasswordLevel = levels.length

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

export function isStrongPassword(password: string) {
  return computePasswordLevel(password) === requiredPasswordLevel
}

export { requiredPasswordLevel }
