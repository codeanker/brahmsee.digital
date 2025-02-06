<script setup lang="ts">
import { ref } from 'vue'

const error = ref<string | null>(null)
// read jwtOAuthToken from url hashbang and emit this to the parent window
if (location.hash) {
  const hash = location.hash.substr(1)
  const hashParams = new URLSearchParams(hash)
  const jwtOAuthToken = hashParams.get('jwtOAuthToken')
  if (jwtOAuthToken) {
    location.hash = ''
    const channel = new BroadcastChannel('auth')
    channel.postMessage({ jwtOAuthToken })
    // close window
    window.close()
  } else {
    error.value = 'Es ist ein Fehler aufgetreten. Bitte schließe das Fenster und versuche es nocheinmal.'
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="grow justify-center items-center flex flex-col text-center space-y-3">
      <!-- <CheckCircleIcon class="w-14 h-14 text-primary-700" /> -->
      <!-- <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
        Registrierung erfolgreich
      </h2> -->
      <div v-if="error">
        {{ error }}
      </div>
      <div v-else>Du kannst das Fenster schließen.</div>
    </div>
  </div>
</template>
