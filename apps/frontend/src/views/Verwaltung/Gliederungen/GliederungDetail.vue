<script setup lang="ts">
import { LockOpenIcon, MegaphoneIcon, PlusIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import GliederungAccessTable from '@/components/data/GliederungAccessTable.vue'
import UnterveranstaltungenTable from '@/components/data/UnterveranstaltungenTable.vue'
import FormGliederungAccess from '@/components/forms/access/FormGliederungAccess.vue'
import FormGliederungGeneral from '@/components/forms/gliederung/FormGliederungGeneral.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Modal from '@/components/UIComponents/Modal.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { useTemplateRef } from 'vue'

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
  { name: 'Berechtigungen', icon: LockOpenIcon },
]

const modalAddPermission = useTemplateRef('modalAddPermission')
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
    <Tab>
      <div class="my-4 flex items-center justify-between">
        <div>
          <p class="text-xl font-bold">Berechtigungen</p>
          <p class="text-sm">Hier findest du eine Übersicht aller Gliederungen, auf welche dieser Account Zugriff hat.</p>
        </div>
        <span
          class="text-primary-500 flex items-center cursor-pointer"
          @click="() => modalAddPermission?.show()"
        >
          <PlusIcon class="h-5 w-5 mr-1" />
          <span>Berechtigung vergeben</span>
        </span>
      </div>

      <GliederungAccessTable
        v-if="gliederung"
        :mode="{ mode: 'gliederung', gliederungId: gliederung.id }"
      />

      <Teleport to="body">
        <Modal ref="modalAddPermission" size="xl">
          <template #content>
            <div class="text-xl font-bold mb-8">Berechtigung vergeben</div>

            <FormGliederungAccess
              v-if="gliederung"
              :mode="{ mode: 'gliederung', gliederungId: gliederung.id }"
              @cancel="() => modalAddPermission?.hide()"
            />
          </template>
        </Modal>
      </Teleport>
    </Tab>
  </Tabs>
</template>
