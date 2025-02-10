<script setup lang="ts">
import FormUnterveranstaltungGeneral from '../../components/forms/unterveranstaltung/FormUnterveranstaltungGeneral.vue'

import { useRouteTitle } from '@/composables/useRouteTitle'

const { setTitle } = useRouteTitle()
setTitle('Ausschreibung erstellen')
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <FormUnterveranstaltungGeneral mode="create" />
  </div>
</template>
