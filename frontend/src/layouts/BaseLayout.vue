<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import Sidebar from '@/components/LayoutComponents/Sidebar/Sidebar.vue'
import Breadcrumbs from '@/components/UIComponents/Breadcrumbs.vue'
import MobileMenuButton from '@/components/UIComponents/MobileMenuButton.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const { title } = useRouteTitle()

const mobileMenuButton = ref()
const showMobileMenu = ref(false)
const globalSearch = ref()

// watch(
//   route,
//   () => {
//     if (showMobileMenu.value) {
//       showMobileMenu.value = false
//       mobileMenuButton.value.animate()
//     }
//   },
//   { deep: true }
// )

function toggleSidebarMenu(show: boolean) {
  if (show !== undefined) {
    showMobileMenu.value = show
  } else {
    showMobileMenu.value = !showMobileMenu.value
  }
  mobileMenuButton.value.animate()
}

function getSearchCommand() {
  return navigator.userAgent.includes('Mac') ? '⌘ K' : 'STR K'
}
</script>

<template>
  <div>
    <GlobalSearch ref="globalSearch" />
    <div class="flex h-screen overflow-hidden relative">
      <Sidebar
        class="shrink-0 h-full p-6 w-72 absolute lg:relative z-50"
        :class="{ 'hidden lg:flex': !showMobileMenu, 'bg-white': showMobileMenu }"
      />
      <div class="grow flex flex-col relative z-40">
        <div
          v-if="showMobileMenu"
          class="inset-0 absolute bg-black/40 z-50"
          @click="toggleSidebarMenu(false)"
        />
        <div class="relative flex items-center justify-between pt-3 pb-3 lg:pt-5 lg:pb-4 shrink-0 space-y-1 z-10">
          <div class="flex">
            <MobileMenuButton
              ref="mobileMenuButton"
              @click="toggleSidebarMenu"
            />
            <div class="flex flex-col justify-center">
              <Breadcrumbs />
              <h5 class="mb-0.5">
                {{ title.name }}
              </h5>
            </div>
          </div>
          <div class="flex items-center space-x-6 pr-6 pb-2">
            <div
              class="cursor-pointer flex space-x-2 items-center group text-gray-500"
              @click="globalSearch.showSearch = !globalSearch.showSearch"
            >
              <div>
                <MagnifyingGlassIcon class="h-4" />
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
        </div>
        <div class="bg-white dark:bg-dark-primary grow p-8 lg:rounded-tl-3xl overflow-y-auto shadow-hover">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
