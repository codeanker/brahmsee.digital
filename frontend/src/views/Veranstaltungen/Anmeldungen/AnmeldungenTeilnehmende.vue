<script setup lang="ts">
import { useVeranstaltung } from '../../../composables/useVeranstaltung'

const { veranstaltung } = useVeranstaltung()
</script>

<template>
  <div>
    <h5>Veranstaltung</h5>
    {{ veranstaltung }}
  </div>
</template>
