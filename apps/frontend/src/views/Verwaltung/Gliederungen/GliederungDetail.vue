<script setup lang="ts">
import { MegaphoneIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormGliederungGeneral from '@/components/forms/gliederung/FormGliederungGeneral.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import UnterveranstaltungenTable from '@/components/data/UnterveranstaltungenTable.vue'

const route = useRoute()
const { setTitle } = useRouteTitle()

const { state: gliederung, execute: fetchGliederung } = useAsyncState(async () => {
  const result = await apiClient.gliederung.verwaltungGet.query({ id: route.params.gliederungId as string })
  setTitle('Gliederung: ' + result.name)
  return result
}, null)

const tabs = [
  { name: 'Stammdaten', icon: UserIcon },
  { name: 'Ausschreibungen', icon: MegaphoneIcon },
]
</script>

<template>
  <Tabs
    content-space="4"
    :tabs="tabs"
  >
    <Tab>
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <FormGliederungGeneral
          v-if="gliederung !== null"
          :gliederung="gliederung"
          mode="update"
          @update="() => fetchGliederung()"
        />
      </div>
    </Tab>
    <Tab>
      <UnterveranstaltungenTable
        v-if="gliederung?.id"
        :mode="
          gliederung
            ? {
                entity: 'gliederung',
                gliederungId: gliederung?.id,
              }
            : undefined
        "
      />
    </Tab>
  </Tabs>
</template>
