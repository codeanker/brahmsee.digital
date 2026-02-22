<script setup lang="ts">
import GliederungAccessTable from '@/components/data/GliederungAccessTable.vue'
import FormGliederungAccess from '@/components/forms/access/FormGliederungAccess.vue'
import Modal from '@/components/UIComponents/Modal.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useTemplateRef } from 'vue'

const modalAdd = useTemplateRef('modalAdd')
</script>

<template>
  <div class="my-4 flex items-center justify-between">
    <div>
      <p class="text-xl font-bold">Gliederungsadmin</p>
      <p class="text-sm">Hier findest du alle Accounts mit Zugriff auf Gliederungen.</p>
    </div>
    <span
      class="text-primary-500 flex items-center cursor-pointer"
      @click="() => modalAdd?.show()"
    >
      <PlusIcon class="h-5 w-5 mr-1" />
      <span>Berechtigung vergeben</span>
    </span>
  </div>

  <GliederungAccessTable />

  <Teleport to="body">
    <Modal ref="modalAdd" size="xl">
      <template #content>
        <div class="text-xl font-bold mb-8">Berechtigung vergeben</div>

        <FormGliederungAccess @cancel="() => modalAdd?.hide()" />
      </template>
    </Modal>
  </Teleport>
</template>
