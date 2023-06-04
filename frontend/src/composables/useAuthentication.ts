import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { apiClient } from '@/api'
import { RouterOutput } from '@codeanker/api'

const user = ref<RouterOutput['authenication']['login']['user']>(null)

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
      user.value = authenticationResponse.user
      return authenticationResponse
    },
    null,
    { immediate: false }
  )

  async function reAuthenticate() {
    try {
      const authenticationResponse = await apiClient.authenication.reAuthenticate.mutate()
      user.value = authenticationResponse.user
    } catch (error) {
      user.value = null
    }
  }

  return {
    login: ({ email, password }) => login(0, { email, password }),
    loginPending,
    loginError,
    reAuthenticate,
    user,
  }
}
