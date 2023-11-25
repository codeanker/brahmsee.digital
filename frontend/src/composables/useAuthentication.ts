import { computed, ref } from 'vue'

import { apiClient } from '../api'

export const loggedInAccount = ref()
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
    return authResult
  } catch (error) {
    loginError.value = error as Error
  }
  loginPending.value = false
}

export async function reAuthenticate() {
  if (localStorage.getItem('jwt') === undefined) return false
  try {
    loggedInAccount.value = await apiClient.person.authenticatedGet.query()
    return loggedInAccount.value
  } catch (error) {
    return false
  }
}

export async function logout() {
  localStorage.removeItem('jwt')
  loggedInAccount.value = undefined
}
