<script setup lang="ts">
import { useRoute } from 'vue-router'

import FormUnterveranstaltungGeneral from '../../components/forms/unterveranstaltung/FormUnterveranstaltungGeneral.vue'

const route = useRoute()
</script>

<template>
  {{ route.params }}
  <FormUnterveranstaltungGeneral mode="create" />
</template>
