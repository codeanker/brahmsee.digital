<template>
  <Sidebar />

  <div class="flex flex-1 flex-col">
    <div class="mt-12 flex-1 lg:mx-8">
      <router-view />
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
</script>
