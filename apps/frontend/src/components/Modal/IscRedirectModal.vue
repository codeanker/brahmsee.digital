<script lang="ts" setup>
import Modal from '@/components/UIComponents/Modal.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { ref } from 'vue'

const modal = ref<InstanceType<typeof Modal>>()

defineExpose({
  show: () => modal.value?.show(),
  hide: () => modal.value?.hide(),
})
</script>

<template>
  <Modal
    ref="modal"
    size="xl"
  >
    <template #content>
      <div class="flex items-center justify-center space-x-4">
        <Loading
          color="primary"
          size="md"
        />
        <span>
          Du wirst nun in das ISC weitergeleitet. Bitte melde dich dort mit deinem DLRG-Account an und bestätige die
          Registrierung.
        </span>
      </div>
    </template>
  </Modal>
</template>
