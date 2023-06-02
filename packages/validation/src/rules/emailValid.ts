const emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
const errorMessage = 'Die Email hat nicht das korrekte Format'
export async function emailValid(value: unknown) {
  if (typeof value !== 'string') return errorMessage
  const emailValid = emailRegex.test(value) && !value.includes(' ')
  if (emailValid) {
    return true
  }
  return 'Die Email hat nicht das korrekte Format'
}
