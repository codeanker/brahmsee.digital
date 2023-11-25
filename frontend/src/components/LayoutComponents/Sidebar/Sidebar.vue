<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  RocketLaunchIcon,
  UserGroupIcon,
  MapIcon,
  ChartBarIcon,
  ScissorsIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import SidebarItems, { type NavItem, type TeamItem } from './SidebarItems.vue'

import { logout, loggedInAccount } from '@/composables/useAuthentication'
import personProfileImage from '@/helpers/personProfileImage'

let mainRoute = '/veranstaltung/1'

const navigation: NavItem[] = [
  { name: 'Dashboard', route: mainRoute + '/dashboard', icon: RocketLaunchIcon, current: false },
  { name: 'Anmeldungen', route: mainRoute + '/anmeldungen', icon: UserGroupIcon, current: false },
  { name: 'Auswertung', route: mainRoute + '/auswertung', icon: ChartBarIcon, current: false },
  { name: 'Lageplan', route: mainRoute + '/lageplan', icon: MapIcon, current: false },
  { name: 'Programm', route: mainRoute + '/programm', icon: ScissorsIcon, current: false },
  // { name: 'Unterbringung', route: '', icon: HomeIcon, current: false },
  // { name: 'Finanzen', route: '', icon: BanknotesIcon, current: false },
]
const teams: TeamItem[] = [
  { id: 1, name: 'Benutzer:innen', route: '/verwaltung/benutzer', initial: 'B', current: false },
  { id: 2, name: 'Gliederungen', route: '/verwaltung/gliederungen', initial: 'V', current: false },
  { id: 3, name: 'Orte', route: '/verwaltung/orte', initial: 'O', current: false },
  { id: 4, name: 'Veranstaltungen', route: '/verwaltung/veranstaltung', initial: 'V', current: false },
  { id: 5, name: 'Komponenten', route: '/develeopment/components', initial: '⚙️', current: false },
]

const sidebarOpen = ref(false)
</script>

<template>
  <aside class="sticky top-0">
    <TransitionRoot
      as="template"
      :show="sidebarOpen"
    >
      <Dialog
        as="div"
        class="relative z-50 lg:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon
                      class="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>

              <SidebarItems
                :navigation="navigation"
                :teams="teams"
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:z-50 lg:flex lg:h-full lg:w-72 lg:flex-col">
      <SidebarItems
        :navigation="navigation"
        :teams="teams"
      />
      <!-- Profile -->
      <div class="grid grid-flow-col gap-x-4 bg-green-800 px-6 py-3 text-sm font-semibold leading-6 text-white">
        <router-link
          :to="{ name: 'Dashboard' }"
          class="flex flex-row items-center gap-x-4"
        >
          <img
            class="h-10 w-10 rounded-full bg-green-700"
            :src="personProfileImage(loggedInAccount)"
            alt=""
          />
          <span aria-hidden="true">Hallo, {{ loggedInAccount?.firstname }}</span>
        </router-link>
        <button
          type="button"
          title="Abmelden"
          @click="logout"
        >
          <ArrowRightOnRectangleIcon class="ml-auto h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Sticky header for mobile -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-green-700 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
        type="button"
        class="-m-2.5 p-2.5 text-green-200 lg:hidden"
        @click="sidebarOpen = true"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon
          class="h-6 w-6"
          aria-hidden="true"
        />
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
      <a href="#">
        <span class="sr-only">Your profile</span>
        <img
          class="h-8 w-8 rounded-full bg-green-700"
          :src="personProfileImage(loggedInAccount)"
          alt=""
        />
      </a>
    </div>
  </aside>
</template>
