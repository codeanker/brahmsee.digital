<script setup lang="ts">
import { useRouter } from 'vue-router'

import Button from '@/components/UIComponents/Button.vue'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { FaceSmileIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div class="grow flex flex-col items-center justify-center">
    <FaceSmileIcon class="w-20 h-20 text-primary-500 mb-5" />
    <h1 class="text-2xl font-semibold mb-2">Anmeldung erfolgreich</h1>
    <p class="mb-5">
      Du hast dich erfolgreich für die Veranstaltung
      <span class="font-semibold">{{ unterveranstaltung?.veranstaltung.name }}</span>
      angemeldet.
    </p>
    <Button
      class="w-full flex justify-center"
      color="secondary"
      @click="router.push('/ausschreibung/' + unterveranstaltung?.id + '/anmeldung')"
    >
      Weitere Person anmelden
    </Button>
  </div>
</template>
