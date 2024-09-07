<script setup lang="ts">
import FormGliederungGeneral from '@/components/forms/gliederung/FormGliederungGeneral.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const { setTitle } = useRouteTitle()
setTitle('Gliederung erstellen')
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <FormGliederungGeneral mode="create" />
  </div>
</template>
