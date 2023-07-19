<template>
  <div>
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
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
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
            :src="userProfileImage(user)"
            alt=""
          />
          <span class="sr-only">Your profile</span>
          <span aria-hidden="true">Hallo, {{ user?.firstname }}</span>
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
          :src="userProfileImage(user)"
          alt=""
        />
      </a>
    </div>

    <main class="py-10 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import useAuthentication from '@/composables/useAuthentication'
import userProfileImage from '@/helpers/userProfileImage'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowRightOnRectangleIcon, Bars3Icon, RocketLaunchIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import SidebarItems from './SidebarItems.vue'
import { NavItem, TeamItem } from '@/types'

const navigation: NavItem[] = [
  { name: 'Dashboard', route: '/dashboard', icon: RocketLaunchIcon, current: false },
  // { name: 'Teilnehmende', route: '', icon: UserGroupIcon, current: false },
  // { name: 'Unterbringung', route: '', icon: HomeIcon, current: false },
  // { name: 'Programm', route: '', icon: TrophyIcon, current: false },
  // { name: 'Finanzen', route: '', icon: BanknotesIcon, current: false },
  // { name: 'Auswertung', route: '', icon: ChartBarIcon, current: false }
]
const teams: TeamItem[] = [
  { id: 1, name: 'Häuser und Zelte', route: '/houses', initial: 'HZ', current: false },
  // { id: 2, name: 'Räume', route: '', initial: 'R', current: false },
  // { id: 3, name: 'Teilnehmende', route: '', initial: 'T', current: false },
  // { id: 4, name: 'CREW', route: '', initial: 'C', current: false },
  { id: 5, name: 'Benutzer:innen', route: '/users', initial: 'B', current: false },
]

const sidebarOpen = ref(false)

const { user, logout } = useAuthentication()
</script>
