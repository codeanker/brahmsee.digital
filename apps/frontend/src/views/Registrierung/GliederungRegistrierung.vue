<script setup lang="ts">
import { CheckCircleIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { apiClient } from '@/api'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import ButtonCard from '@/components/UIComponents/ButtonCard.vue'
import IscBadge from '@/components/IscBadge.vue'
import Modal from '@/components/UIComponents/Modal.vue'
import { toast } from 'vue-sonner'
import IscRedirectModal from '@/components/Modal/IscRedirectModal.vue'
import RegisterModal from '@/components/Modal/RegisterModal.vue'
import { useAssets } from '@/composables/useAssets'

const { logo } = useAssets()

const iscModal = ref<InstanceType<typeof Modal>>()
const defaultModal = ref<InstanceType<typeof Modal>>()

const account = ref<null | Awaited<RouterOutput['account']['gliederungAdminCreate']>>(null)
const isOauthRegistration = ref(false)

async function watiForOAuth(): Promise<string> {
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

type TAccountData = RouterInput['account']['gliederungAdminCreate']['data']

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

      accountData.jwtOAuthToken = await watiForOAuth()
      accountData.password = undefined
      accountData.email = undefined
    }

    account.value = await apiClient.account.gliederungAdminCreate.mutate({
      data: accountData as unknown as RouterInput['account']['gliederungAdminCreate']['data'],
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
        <h2 class="text-center text-4xl text-primary-700">Registrierung als Gliederung</h2>
        <p class="text-center text-red-600 font-bold">
          Bitte beachte das diese Registrierung nur für Verantwortliche einer Gliederung vorgesehen ist.
        </p>
        <p class="text-center">Wie möchtest Du dich registrieren?</p>
      </div>

      <!-- Form -->
      <div
        v-if="!account"
        class="space-y-4"
      >
        <ButtonCard
          :badge="IscBadge"
          title="Mit DLRG-Account"
          description="Registriere dich bequem mit deinem bestehenden DLRG-Account."
          @click="iscModal?.show()"
        />
        <ButtonCard
          title="Mit E-Mail und Passwort"
          description="Registriere dich mit deiner E-Mail Adresse und einem Passwort."
          @click="defaultModal?.show()"
        />
      </div>

      <div
        v-if="account"
        class="grow justify-center items-center flex flex-col text-center space-y-3"
      >
        <CheckCircleIcon class="w-14 h-14 text-primary-700" />
        <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
          Registrierung erfolgreich
        </h2>
        <div>Du hast Dich erfolgreich registriert. Wir haben dir eine E-Mail mit einem Bestätigungslink geschickt.</div>
      </div>
    </div>
  </div>
</template>
