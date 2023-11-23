import { computed, ref } from 'vue'

import { apiClient } from '../api'

export const loggedInUser = ref()
export const isAuthenticated = computed(() => loggedInUser.value !== undefined)

export const loginPending = ref(false)
export const loginError = ref<Error | null>(null)

export async function login({ email, password }: { email: string; password: string }) {
  loginPending.value = true
  loginError.value = null
  try {
    const authResult = await apiClient.authenication.login.mutate({ email, password })
    loggedInUser.value = authResult.user
    localStorage.setItem('jwt', authResult.accessToken)
    return authResult
  } catch (error) {
    loginError.value = error as Error
  }
}

export async function reAuthenticate() {
  loggedInUser.value = await apiClient.user.authenticatedGet.query()
  return loggedInUser.value
}

export async function logout() {
  localStorage.removeItem('jwt')
  loggedInUser.value = undefined
}
