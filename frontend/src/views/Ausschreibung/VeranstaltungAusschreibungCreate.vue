<script setup lang="ts">
import { useRoute } from 'vue-router'

import FormAusschreibungGeneral from '@/components/forms/ausschreibung/FormAusschreibungGeneral.vue'

const route = useRoute()
</script>

<template>
  {{ route.params }}
  <FormAusschreibungGeneral mode="create" />
</template>
