import { computed, ref } from 'vue'

import { apiClient } from '../api'

import router from '@/router'
import type { RouterOutput } from '@codeanker/api'

type LoggedInAccount = Awaited<RouterOutput['authentication']['login']>['user']

export const loggedInAccount = ref<LoggedInAccount>()
export const isAuthenticated = computed(() => loggedInAccount.value !== undefined)

export const loginPending = ref(false)
export const loginError = ref<Error | null>(null)

export async function login({ email, password }: { email: string; password: string }) {
  loginPending.value = true
  loginError.value = null
  try {
    const authResult = await apiClient.authentication.login.mutate({ email, password })
    loggedInAccount.value = authResult.user
    localStorage.setItem('jwt', authResult.accessToken)
    loginPending.value = false
    return authResult
  } catch (error) {
    loginPending.value = false
    loginError.value = error as Error
  }
}

export async function reAuthenticate() {
  const storedJwt = localStorage.getItem('jwt')
  if (storedJwt === null) return false
  const payload = parseJwt(storedJwt)
  const expirationDate = new Date(payload.exp * 1000)
  const now = new Date()
  if (expirationDate < now) {
    localStorage.removeItem('jwt')
    return false
  }
  try {
    loggedInAccount.value = await apiClient.person.authenticatedGet.query()
    return loggedInAccount.value
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false
  }
}

export async function logout(redirect: boolean = true) {
  localStorage.removeItem('jwt')
  if (redirect) {
    router.push({ name: 'Login' })
  }
  loggedInAccount.value = undefined
}

function parseJwt(jwt: string) {
  const [, payload] = jwt.split('.')
  return JSON.parse(atob(payload)) as {
    exp: number
    iat: number
    sub: string
  }
}
