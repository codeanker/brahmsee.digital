<script setup lang="ts">
import GliederungLogo from '@/components/UIComponents/GliederungLogo.vue'
import { loggedInAccount, logout } from '@/composables/useAuthentication'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { RouterLink } from 'vue-router'

const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div class="flex items-center justify-between mb-4 py-6">
    <GliederungLogo :name="unterveranstaltung?.gliederung?.name ?? ''" />

    <div class="text-sm text-right">
      <template v-if="loggedInAccount">
        <p>
          Du bist angemeldet als: <u>{{ loggedInAccount.person.firstname }} {{ loggedInAccount.person.lastname }}</u>
        </p>
        <p>
          <u>Account wechseln?</u> oder
          <u
            class="cursor-pointer"
            @click="() => logout(false)"
          >
            Abmelden?
          </u>
        </p>
      </template>
      <template v-else>
        <RouterLink
          class="cursor-pointer underline"
          :to="{ name: 'Login', query: { redirect: '/ausschreibung/' + unterveranstaltung?.id } }"
        >
          Anmelden?
        </RouterLink>
      </template>
    </div>
  </div>
</template>
