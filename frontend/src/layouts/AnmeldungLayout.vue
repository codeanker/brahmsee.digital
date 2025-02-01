<script setup lang="ts">
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import type { RouterOutput } from '@codeanker/api'
import { useAsyncState } from '@vueuse/core'
import { computed, inject, provide, type Ref } from 'vue'
import PublicLayout from './PublicLayout.vue'

const route = useRoute()

const unterveranstaltungId = computed(() => {
  return parseInt(route.params.unterveranstaltungId as string)
})

const { state: unterveranstaltung } = useAsyncState(
  () => apiClient.unterveranstaltung.publicGet.query({ id: unterveranstaltungId.value }),
  undefined
)

provide('unterveranstaltung', unterveranstaltung)
</script>

<script lang="ts">
export function injectUnterveranstaltung() {
  return inject<Ref<RouterOutput['unterveranstaltung']['publicGet']>>('unterveranstaltung')
}
</script>

<template>
  <PublicLayout>
    <!-- Header -->
    <div class="sticky top-0 bg-white dark:bg-dark-primary z-10 pb-8">
      <PublicHeader />
      <div class="text-3xl font-medium">Ausschreibung {{ unterveranstaltung?.veranstaltung.name }}</div>
    </div>

    <router-view />

    <PublicFooter />
  </PublicLayout>
</template>
