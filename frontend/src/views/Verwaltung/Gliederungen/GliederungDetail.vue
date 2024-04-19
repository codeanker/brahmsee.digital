<script setup lang="ts">
import { MegaphoneIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormGliederungGeneral from '@/components/forms/gliederung/FormGliederungGeneral.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'

const route = useRoute()

const { state: gliederung, execute: fetchGliederung } = useAsyncState(async () => {
  return apiClient.gliederung.verwaltungGet.query({ id: parseInt(route.params.gliederungId as string) })
}, null)

const tabs = [
  { name: 'Stammdaten', icon: UserIcon },
  { name: 'Ausschreibungen', icon: MegaphoneIcon },
]
</script>

<template>
  <div>
    <h5>Gliederungen Detail</h5>
    <Tabs
      content-space="4"
      :tabs="tabs"
    >
      <Tab>
        <FormGliederungGeneral
          v-if="gliederung !== null"
          :gliederung="gliederung"
          mode="update"
          @update="() => fetchGliederung()"
        ></FormGliederungGeneral>
      </Tab>
    </Tabs>
  </div>
</template>
