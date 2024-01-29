<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Sidebar from '@/components/LayoutComponents/Sidebar/Sidebar.vue'
import Breadcrumbs from '@/components/UIComponents/Breadcrumbs.vue'
import MobileMenuButton from '@/components/UIComponents/MobileMenuButton.vue'

const route = useRoute()
const mobileMenuButton = ref()

watch(
  route,
  () => {
    if (showMobileMenu.value) {
      showMobileMenu.value = false
      mobileMenuButton.value.animate()
    }
  },
  { deep: true }
)

const showMobileMenu = ref(false)
</script>

<template>
  <div>
    <div
      class="container mx-auto p-0 h-full grid grid-cols-9 lg:grid-cols-12 gap-8 transform transition-transform duration-300"
      :class="{ 'translate-x-[80%]': showMobileMenu }"
    >
      <div class="fixed w-80 -left-[80%] lg:w-full lg:col-span-3 h-screen lg:sticky top-0">
        <Sidebar />
      </div>
      <div class="min-h-screen col-span-9 relative p-4 pb-12 lg:py-12 lg:px-8">
        <div class="bg-white absolute inset-y-0 left-0 -right-full"></div>
        <MobileMenuButton
          ref="mobileMenuButton"
          @click="showMobileMenu = !showMobileMenu"
        />
        <div class="relative">
          <Breadcrumbs />
          <router-view />
        </div>
        <div
          class="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm transition-all pointer-events-none"
          :class="showMobileMenu ? 'opacity-100' : 'opacity-0'"
        />
      </div>
    </div>
  </div>
</template>
