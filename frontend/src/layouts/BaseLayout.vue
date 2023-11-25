<script setup lang="ts">
import Sidebar from '@/components/LayoutComponents/Sidebar/Sidebar.vue'
</script>

<template>
  <!-- Background -->
  <div class="w-full h-full grid grid-cols-2">
    <div />
    <div class="h-full bg-white" />
  </div>
  <!-- Content -->
  <div class="absolute w-screen h-screen">
    <div class="container p-0 h-full bg-white grid grid-cols-12 gap-6">
      <div class="col-span-3 bg-gray-50 border-r border-gray-300">
        <Sidebar />
      </div>
      <div class="col-span-9">
        <router-view />
      </div>
    </div>
  </div>
</template>
