const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')
const errorMessage = 'Die Email hat nicht das korrekte Format'
export function emailValid(value: unknown) {
  if (typeof value !== 'string') return errorMessage
  const emailValid = emailRegex.test(value) && !value.includes(' ')
  if (emailValid) {
    return true
  }
  return 'Die Email hat nicht das korrekte Format'
}
