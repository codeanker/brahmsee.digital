<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
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
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-green-700 px-6 pb-2">
                <router-link :to="{ name: 'Dashboard' }">
                  <div class="flex h-16 shrink-0 items-center space-x-4">
                    <FontAwesomeIcon
                      :icon="faTents"
                      class="h-8 w-auto text-white"
                    />
                    <div class="font-bold uppercase text-white">Brahmsee</div>
                  </div>
                </router-link>
                <nav class="flex flex-1 flex-col">
                  <ul
                    role="list"
                    class="flex flex-1 flex-col gap-y-7"
                  >
                    <li>
                      <ul
                        role="list"
                        class="-mx-2 space-y-1"
                      >
                        <li
                          v-for="item in navigation"
                          :key="item.name"
                        >
                          <router-link
                            :to="{ path: item.route }"
                            :class="[
                              item.current
                                ? 'bg-green-700 text-white'
                                : 'text-green-200 hover:bg-green-700 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            ]"
                          >
                            <component
                              :is="item.icon"
                              :class="[
                                item.current ? 'text-white' : 'text-green-200 group-hover:text-white',
                                'h-6 w-6 shrink-0',
                              ]"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="text-xs font-semibold leading-6 text-green-200">Einstellungen</div>
                      <ul
                        role="list"
                        class="-mx-2 mt-2 space-y-1"
                      >
                        <li
                          v-for="team in teams"
                          :key="team.name"
                        >
                          <router-link
                            :to="{ path: team.route }"
                            :class="[
                              team.current
                                ? 'bg-green-700 text-white'
                                : 'text-green-200 hover:bg-green-700 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            ]"
                          >
                            <span
                              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-400 bg-green-500 text-[0.625rem] font-medium text-white"
                              >{{ team.initial }}</span
                            >
                            <span class="truncate">{{ team.name }}</span>
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-green-700 px-6">
        <router-link :to="{ name: 'Dashboard' }">
          <div class="flex h-16 shrink-0 items-center space-x-3">
            <FontAwesomeIcon
              :icon="faTents"
              class="h-8 w-auto text-white"
            />
            <div class="font-bold uppercase text-white">Brahmsee</div>
          </div>
        </router-link>
        <nav class="flex flex-1 flex-col">
          <ul
            role="list"
            class="flex flex-1 flex-col gap-y-7"
          >
            <li>
              <ul
                role="list"
                class="-mx-2 space-y-1"
              >
                <li
                  v-for="item in navigation"
                  :key="item.name"
                >
                  <router-link
                    :to="{ path: item.route }"
                    :class="[
                      item.current ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        item.current ? 'text-white' : 'text-green-200 group-hover:text-white',
                        'h-6 w-6 shrink-0',
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li>
              <div class="text-xs font-semibold leading-6 text-green-200">Einstellung</div>
              <ul
                role="list"
                class="-mx-2 mt-2 space-y-1"
              >
                <li
                  v-for="team in teams"
                  :key="team.name"
                >
                  <router-link
                    :to="{ path: team.route }"
                    :class="[
                      team.current ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                    ]"
                  >
                    <span
                      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-400 bg-green-500 text-[0.625rem] font-medium text-white"
                      >{{ team.initial }}</span
                    >
                    <span class="truncate">{{ team.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <a
                href="#"
                class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-green-700"
              >
                <img
                  class="h-8 w-8 rounded-full bg-green-700"
                  :src="userProfileImage(user)"
                  alt=""
                />
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">{{ user.firstname }} {{ user.lastname }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

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

<script setup>
import useAuthentication from '@/composables/useAuthentication'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTents } from '@fortawesome/pro-light-svg-icons'
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import userProfileImage from '@/helpers/userProfileImage'
import {
  BanknotesIcon,
  Bars3Icon,
  ChartBarIcon,
  FlagIcon,
  FolderIcon,
  HomeIcon,
  RocketLaunchIcon,
  TrophyIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Dashboard', route: '/dashboard', icon: RocketLaunchIcon, current: false },
  // { name: 'Teilnehmende', route: '', icon: UserGroupIcon, current: false },
  // { name: 'Unterbringung', route: '', icon: HomeIcon, current: false },
  // { name: 'Programm', route: '', icon: TrophyIcon, current: false },
  // { name: 'Finanzen', route: '', icon: BanknotesIcon, current: false },
  // { name: 'Auswertung', route: '', icon: ChartBarIcon, current: false }
]
const teams = [
  { id: 1, name: 'Häuser und Zelte', route: '/houses', initial: 'HZ', current: false },
  // { id: 2, name: 'Räume', route: '', initial: 'R', current: false },
  // { id: 3, name: 'Teilnehmende', route: '', initial: 'T', current: false },
  // { id: 4, name: 'CREW', route: '', initial: 'C', current: false },
  { id: 5, name: 'Benutzer:innen', route: '/users', initial: 'B', current: false },
]

const sidebarOpen = ref(false)

const { user } = useAuthentication()
</script>
