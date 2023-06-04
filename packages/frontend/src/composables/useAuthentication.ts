import { useAsyncState } from '@vueuse/core'
import { Ref, ref } from 'vue'
import { featherClient, featherSocketClient } from '@/api'
import { User } from '@codeanker/api'

const user: Ref<null | User> = ref(null)

export default function useAuthentication() {
  const {
    isLoading: loginPending,
    execute: login,
    error: loginError,
  } = useAsyncState(
    async ({ email, password }) => {
      const authenticationResponse = await featherClient.authenticate({
        strategy: 'local',
        email: email,
        password: password,
      })
      await featherSocketClient.authenticate({
        strategy: 'jwt',
        accessToken: authenticationResponse.accessToken,
      })
      user.value = authenticationResponse.user
      return authenticationResponse
    },
    null,
    { immediate: false }
  )

  async function reAuthenticate() {
    try {
      const authenticationResponse = await featherClient.reAuthenticate()
      await featherSocketClient.authenticate({
        strategy: 'jwt',
        accessToken: authenticationResponse.accessToken,
      })
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
