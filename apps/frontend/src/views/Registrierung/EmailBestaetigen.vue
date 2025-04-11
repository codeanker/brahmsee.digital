<script setup lang="ts">
import { CheckCircleIcon, FaceFrownIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Loading from '@/components/UIComponents/Loading.vue'

const route = useRoute()
const router = useRouter()

const { state: account, isLoading: isLoading } = useAsyncState(async () => {
  return apiClient.account.emailConfirm.mutate({ activationToken: route.params.activationToken as string })
}, null)

const feedback = computed(() => {
  if (account.value?.status == 'InvalidLink') {
    return {
      title: 'Der Link ist ungültig.',
      message: 'Stelle sicher, dass der Token in der URL Leiste richtig ist.',
      showLoginButton: false,
      icon: QuestionMarkCircleIcon,
    }
  }
  if (account.value?.status == 'AccountActivated') {
    return {
      title: 'E-Mail erfolgreich bestätigt.',
      message: 'Danke, dass Du deine E-Mail bestätigt hast. Du kannst dich jetzt einloggen.',
      showLoginButton: true,
      icon: CheckCircleIcon,
    }
  }

  return {
    title: 'Fehler',
    message: 'Etwas ist schiefgelaufen.',
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

      <div class="text-3xl font-medium">
        {{ feedback?.title }}
      </div>
      <div>{{ feedback?.message }}</div>
      <button
        v-if="feedback?.showLoginButton"
        type="button"
        class="btn-primary"
        @click="router.push({ name: 'Login' })"
      >
        Jetzt anmelden
      </button>
    </div>

    <div class="flex flex-col">
      <PublicFooter />
    </div>
  </div>
</template>
