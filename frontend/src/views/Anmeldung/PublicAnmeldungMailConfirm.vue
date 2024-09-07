<script setup lang="ts">
import { FaceFrownIcon, FaceSmileIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'

const route = useRoute()
const router = useRouter()

const { state: account, isLoading: isLoading } = useAsyncState(async () => {
  return apiClient.anmeldung.emailConfirm.mutate({
    activationTokens: [route.params.activationTokenAccount as string, route.params.activationTokenAnmeldung as string],
  })
}, null)

const feedback = computed(() => {
  if (account.value?.status == 'InvalidLink') {
    return {
      title: 'Der Link ist ungültig',
      message: 'Stelle sicher, dass der Token in der URL Leiste richtig ist.',
      showLoginButton: false,
      icon: QuestionMarkCircleIcon,
    }
  }
  if (account.value?.status == 'AccountActivated') {
    return {
      title: 'Anmeldung erfolgreich bestätigt',
      message:
        'Vielen Dank für die Bestätigung deiner Anmeldung. Du kannst sie jetzt ansehen oder das Fenster schließen.',
      showLoginButton: true,
      icon: FaceSmileIcon,
    }
  }

  return {
    title: 'Fehler',
    message: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    showLoginButton: true,
    icon: FaceFrownIcon,
  }
})
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full grow">
    <!-- Header -->
    <PublicHeader />
    <div
      v-if="isLoading"
      class="grow justify-center items-center flex flex-col text-center space-y-3"
    >
      <Loading
        size="md"
        class="mb-2 text-primary-700"
      />
      <div class="text-3xl font-medium">Wir prüfen deine Anfrage</div>
      <div>Wir brauchen einen Moment um deine Anfrage zu bestätigen</div>
    </div>
    <div
      v-if="!isLoading"
      class="grow justify-center items-center flex flex-col text-center space-y-3"
    >
      <component
        :is="feedback?.icon"
        class="w-14 h-14 text-primary-700"
      />

      <div class="text-3xl font-medium">{{ feedback?.title }}</div>
      <div>{{ feedback?.message }}</div>
      <Button
        v-if="feedback?.showLoginButton"
        type="button"
        color="primary"
        @click="router.push({ name: 'Login' })"
      >
        Anmeldung ansehen
      </Button>
    </div>

    <div class="flex flex-col">
      <PublicFooter />
    </div>
  </div>
</template>
