<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import Sidebar from '@/components/LayoutComponents/Sidebar/Sidebar.vue'
import Breadcrumbs from '@/components/UIComponents/Breadcrumbs.vue'
import MobileMenuButton from '@/components/UIComponents/MobileMenuButton.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const route = useRoute()
const { title } = useRouteTitle()

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
    <div class="flex h-screen overflow-hidden relative">
      <Sidebar
        class="shrink-0 h-full p-6 w-72 absolute lg:relative z-40"
        :class="{ 'hidden lg:flex': !showMobileMenu }"
      />
      <div class="grow flex flex-col relative z-40">
        <div
          v-if="showMobileMenu"
          class="inset-0 absolute bg-black/40 z-50"
          @click="showMobileMenu = false"
        />
        <div class="relative flex items-center justify-between pt-5 pb-5 lg:pb-4 shrink-0 space-y-1 z-10">
          <div>
            <MobileMenuButton
              ref="mobileMenuButton"
              @click="showMobileMenu = !showMobileMenu"
            />
            <div class="flex flex-col justify-center">
              <Breadcrumbs />
              <h5 class="mb-0.5">{{ title.name }}</h5>
            </div>
          </div>
          <div class="flex items-center space-x-6 pr-6 pb-2">
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
        </div>
        <div class="bg-white dark:bg-dark-primary grow p-6 lg:rounded-tl-3xl overflow-y-auto shadow-hover">
          <router-view />
        </div>
      </div>
    </div>
  </div>
  <!-- <div>

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
  </div> -->
</template>
