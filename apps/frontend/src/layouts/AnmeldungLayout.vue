<script setup lang="ts">
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import type { RouterOutput } from '@codeanker/api'
import { useAsyncState } from '@vueuse/core'
import { computed, inject, provide, ref, type Ref } from 'vue'

const route = useRoute()

const unterveranstaltungId = computed(() => {
  return parseInt(route.params.unterveranstaltungId as string)
})

const { state: unterveranstaltung } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({
    id: unterveranstaltungId.value,
  })
}, null)

provide('unterveranstaltung', unterveranstaltung)
</script>

<script lang="ts">
type Unterveranstaltung = RouterOutput['unterveranstaltung']['publicGet']

const emptyRef = ref()

export function injectUnterveranstaltung() {
  return inject<Ref<Unterveranstaltung>>('unterveranstaltung', emptyRef)
}
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-dark-primary min-h-full transition-colors duration-200 justify-between sm:px-6 lg:px-8"
  >
    <PublicHeader />
    <div class="z-10">
      <router-view />
    </div>
    <PublicFooter />
  </div>
</template>

<style lang="scss">
html {
  font-size: 16px;
}
</style>
