<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { apiClient } from '@/api'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import ButtonCard from '@/components/UIComponents/ButtonCard.vue'
import IscBadge from '@/components/IscBadge.vue'
import IscRedirectModal from '@/components/Modal/IscRedirectModal.vue'
import RegisterModal from '@/components/Modal/RegisterModal.vue'
import { toast } from 'vue-sonner'
import { useAssets } from '@/composables/useAssets'

const { logo } = useAssets()

const iscModal = ref<InstanceType<typeof IscRedirectModal>>()
const defaultModal = ref<InstanceType<typeof RegisterModal>>()

const account = ref<null | Awaited<RouterOutput['account']['teilnehmerCreate']>>(null)
const isOauthRegistration = ref(false)

async function waitForOAuth(): Promise<string> {
  const channel = new BroadcastChannel('auth')
  return new Promise((resolve, reject) => {
    channel.addEventListener('message', (event) => {
      if (event.data.jwtOAuthToken) {
        resolve(event.data.jwtOAuthToken)
      } else {
        reject(new Error('no jwtOAuthToken'))
      }
    })
  })
}

type TAccountData = RouterInput['account']['teilnehmerCreate']['data']

async function registerGliederung(stammdatenForm, registrationForm) {
  try {
    account.value = null
    const accountData: TAccountData = {
      firstname: stammdatenForm.firstname,
      lastname: stammdatenForm.lastname,
      gender: stammdatenForm.gender,
      birthday: stammdatenForm.birthday ?? new Date(),
      email: registrationForm.email,
      password: registrationForm.password,
      gliederungId: registrationForm.gliederung!.id,
    }

    if (isOauthRegistration.value) {
      // first optain jwt containing the oauth sub id
      // open new tab with oauth login

      const origin = `${location.href}/api`
      const oauthHref = `/api/connect/dlrg?mode=register&origin=${encodeURIComponent(origin)}`
      window.open(oauthHref, '_blank')

      accountData.jwtOAuthToken = await waitForOAuth()
      accountData.password = undefined
      accountData.email = undefined
    }

    account.value = await apiClient.account.teilnehmerCreate.mutate({
      data: accountData as unknown as RouterInput['account']['teilnehmerCreate']['data'],
    })
  } catch {
    toast.error('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.', {
      duration: 5000,
    })
  }
}
</script>

<template>
  <div class="h-svh flex flex-col items-center w-full p-6 lg:p-0">
    <!-- Modals -->
    <IscRedirectModal ref="iscModal" />
    <RegisterModal
      ref="defaultModal"
      :account="account"
      :is-oauth-registration="isOauthRegistration"
      @submit="registerGliederung"
    />

    <div class="flex h-full flex-col lg:justify-center w-full lg:max-w-xl space-y-12">
      <div class="flex">
        <RouterLink
          :to="{ name: 'Registrierung' }"
          class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600 space-x-1"
        >
          <ChevronLeftIcon class="h-5 w-5" />
          <span>Zurück</span>
        </RouterLink>
      </div>

      <!-- Title Header -->
      <div class="flex flex-col space-y-4 items-center justify-center relative">
        <img
          :src="logo"
          alt="Brahmsee Logo"
          class="size-28"
        />
        <h2 class="text-center text-4xl text-primary-700">Registrierung als Teilnehmer</h2>
        <p class="text-center">Wie möchtest Du dich registrieren?</p>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <ButtonCard
          v-if="iscModal"
          :badge="IscBadge"
          title="Mit DLRG-Account"
          description="Registriere dich bequem mit deinem bestehenden DLRG-Account."
          @click="iscModal.show()"
        />
        <ButtonCard
          v-if="defaultModal"
          title="Mit E-Mail und Passwort"
          description="Registriere dich mit deiner E-Mail Adresse und einem Passwort."
          @click="defaultModal.show()"
        />
      </div>
    </div>
  </div>
</template>
