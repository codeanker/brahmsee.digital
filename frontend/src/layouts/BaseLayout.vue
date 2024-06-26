<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import Sidebar from '@/components/LayoutComponents/Sidebar/Sidebar.vue'
import Breadcrumbs from '@/components/UIComponents/Breadcrumbs.vue'
import MobileMenuButton from '@/components/UIComponents/MobileMenuButton.vue'

const route = useRoute()
const mobileMenuButton = ref()
const showMobileMenu = ref(false)
const globalSearch = ref()

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

function getSearchCommand() {
  return navigator.userAgent.includes('Mac') ? '⌘ K' : 'STR K'
}
</script>

<template>
  <div>
    <GlobalSearch ref="globalSearch"></GlobalSearch>
    <div
      id="base-layout"
      class="container mx-auto p-0 h-full grid grid-cols-9 lg:grid-cols-12 gap-8 transform transition-all duration-300"
      :class="{ 'translate-x-[80%]': showMobileMenu }"
    >
      <div class="fixed w-80 -left-[80%] lg:w-full lg:col-span-3 h-screen lg:sticky top-0">
        <Sidebar />
      </div>
      <div class="min-h-screen col-span-9 relative p-4 pb-12 lg:py-12 lg:px-8">
        <div class="bg-white dark:bg-dark-primary absolute inset-y-0 left-0 -right-full"></div>
        <MobileMenuButton
          ref="mobileMenuButton"
          @click="showMobileMenu = !showMobileMenu"
        />
        <div class="relative">
          <div
            class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-5 pb-3 text-sm"
          >
            <div
              class="cursor-pointer flex space-x-2 items-center group text-gray-500"
              @click="globalSearch.showSearch = !globalSearch.showSearch"
            >
              <div>
                <MagnifyingGlassIcon class="h-4"></MagnifyingGlassIcon>
              </div>
              <div>Suche</div>

              <div
                class="px-1.5 py-0.5 border border-gray-200 text-gray-500 rounded-md text-xs group-hover:border-primary-500 group-hover:text-primary-500 transition-colors duration-200"
              >
                <kbd class="font-sans">{{ getSearchCommand() }}</kbd>
              </div>
            </div>

            <DarkModeSwitch />
          </div>
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
