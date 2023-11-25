<script setup lang="ts">
import Sidebar from '@/components/LayoutComponents/Sidebar/Sidebar.vue'
</script>

<template>
  <div>
    <!-- Content -->
    <div class="container mx-auto p-0 h-full grid grid-cols-12 gap-8">
      <div class="col-span-3 pt-12 h-screen sticky top-0">
        <Sidebar />
      </div>
      <div class="col-span-9 relative py-12 px-8">
        <div class="bg-white absolute inset-y-0 left-0 -right-full"></div>
        <div class="relative">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
