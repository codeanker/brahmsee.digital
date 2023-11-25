<script setup lang="ts">
import ComponentPreview from './components/ComponentPreview.vue'

import Loading from '@/components/UIComponents/Loading.vue'
</script>

<template>
  <div>
    <h3>Komponenten</h3>
    <h4>UI Komponenten</h4>
    <ComponentPreview
      name="Loading"
      description="Loading component"
      code="<Loading />"
    >
      <Loading color="primary" />
      <Loading color="secondary" />
      <Loading color="warning" />
      <Loading color="danger" />
      <div class="rounded-md bg-gray-700 p-2">
        <Loading color="white" />
      </div>
    </ComponentPreview>
  </div>
</template>
