<script setup lang="ts">
import { useRoute } from 'vue-router'

import FormUnterveranstaltungGeneral from '../../components/forms/unterveranstaltung/FormUnterveranstaltungGeneral.vue'

const route = useRoute()
</script>

<template>
  <FormUnterveranstaltungGeneral
    :veranstaltung-id="route.params.veranstaltungId"
    mode="create"
  />
</template>
