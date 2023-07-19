<template>
  <div>
    <!-- header -->
    <Sidebar>
      <router-view />
    </Sidebar>

    <!-- footer -->
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
</script>
