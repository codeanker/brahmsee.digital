<script setup lang="ts">
import Footer from '@/components/LayoutComponents/Footer.vue'
import Sidebar from '@/components/LayoutComponents/Sidebar/Sidebar.vue'
</script>

<template>
  <Sidebar />

  <div class="flex flex-1 flex-col">
    <div class="flex-grow pt-12">
      <router-view />
    </div>

    <Footer />
  </div>
</template>
