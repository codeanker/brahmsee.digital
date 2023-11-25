<script setup lang="ts">
import ComponentPreview from './components/ComponentPreview.vue'

import Loading from '@/components/UIComponents/Loading.vue'

const loadingCode = `
<Loading color="primary" />
<Loading color="secondary" />
<Loading color="warning" />
<Loading color="danger" />
<div class="rounded-md bg-gray-700">
  <Loading color="white" />
</div>
<Loading size="sm" />
<Loading size="md" />
<Loading size="lg" />`
</script>

<template>
  <div>
    <h3>Komponenten</h3>
    <h4>UI Komponenten</h4>
    <ComponentPreview
      name="Loading"
      description="Loading component"
      :code="loadingCode"
    >
      <div class="flex items-center space-x-2">
        <Loading color="primary" />
        <Loading color="secondary" />
        <Loading color="warning" />
        <Loading color="danger" />
        <div class="rounded-md bg-gray-700">
          <Loading color="white" />
        </div>
        <Loading size="sm" />
        <Loading size="md" />
        <Loading size="lg" />
      </div>
    </ComponentPreview>
  </div>
</template>
