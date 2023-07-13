import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { apiClient } from '@/api'
import { RouterOutput } from '@codeanker/api'

const user = ref<RouterOutput['authenication']['login']['user'] | null>(null)

export default function useAuthentication() {
  const {
    isLoading: loginPending,
    execute: login,
    error: loginError,
  } = useAsyncState(
    async ({ email, password }) => {
      const authenticationResponse = await apiClient.authenication.login.mutate({
        email: email,
        password: password,
      })
      localStorage.setItem('jwt', authenticationResponse.accessToken)
      user.value = authenticationResponse.user
      return authenticationResponse
    },
    null,
    { immediate: false }
  )

  async function reAuthenticate() {
    try {
      const accessToken = localStorage.getItem('jwt')
      if (accessToken) {
        const authenticationResponse = await apiClient.authenication.reAuthenticate.mutate({ accessToken })
        if ('user' in authenticationResponse) {
          user.value = authenticationResponse.user
        }
      }
    } catch (error) {
      user.value = null
    }
  }

  function logout() {
    localStorage.clear()
    location.reload()
  }

  return {
    login: ({ email, password }) => login(0, { email, password }),
    loginPending,
    loginError,
    reAuthenticate,
    logout,
    user,
  }
}
