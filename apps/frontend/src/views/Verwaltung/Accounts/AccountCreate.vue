<script setup lang="ts">
import FormAccountGeneral from '@/components/forms/account/FormAccountGeneral.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const { setTitle } = useRouteTitle()
setTitle('Account erstellen')
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <FormAccountGeneral />
  </div>
</template>
