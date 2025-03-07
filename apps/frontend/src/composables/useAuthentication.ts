import { computed, ref } from 'vue'

import { apiClient } from '../api'

import router from '@/router'
import type { RouterOutput } from '@codeanker/api'

type LoggedInAccount = RouterOutput['authentication']['login']['account']

export const loggedInAccount = ref<LoggedInAccount>()
export const isAuthenticated = computed(() => loggedInAccount.value !== undefined)

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
