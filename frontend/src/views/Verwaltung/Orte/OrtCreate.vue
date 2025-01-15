<script setup lang="ts">
import FormOrtGeneral from '@/components/forms/ort/FormOrtGeneral.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const { setTitle } = useRouteTitle()
setTitle('Ort erstellen')
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <FormOrtGeneral mode="create" />
  </div>
</template>
