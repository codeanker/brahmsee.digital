<script setup lang="ts">
import {
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  MapIcon,
  MegaphoneIcon,
  UsersIcon,
  MapPinIcon,
  GlobeEuropeAfricaIcon,
  CubeIcon,
  CalendarDaysIcon,
  RocketLaunchIcon,
} from '@heroicons/vue/24/outline'

import SidebarItems, { type DividerItem, type SidebarItem } from './SidebarItems.vue'

import { logout, loggedInAccount } from '@/composables/useAuthentication'
import personProfileImage from '@/helpers/personProfileImage'

let mainRoute = '/veranstaltung/1'

const navigation: Array<SidebarItem | DividerItem> = [
  { type: 'SidebarItem', name: 'Dashboard', route: '/dashboard', icon: RocketLaunchIcon },
  {
    type: 'SidebarItem',
    name: 'Anmeldungen',
    route: mainRoute + '/anmeldungen',
    icon: UserGroupIcon,
    showChildren: false,
    children: [
      {
        type: 'SidebarItem',
        name: 'CREW',
        route: mainRoute + '/anmeldungen/crew',
        icon: UserGroupIcon,
        disabled: true,
      },
      {
        type: 'SidebarItem',
        name: 'Gliederungen',
        route: mainRoute + '/anmeldungen/gliederungen',
        icon: UserGroupIcon,
        disabled: true,
      },
      {
        type: 'SidebarItem',
        name: 'Teilnehmende',
        route: mainRoute + '/anmeldungen/teilnehmende',
        icon: UserGroupIcon,
      },
    ],
  },
  { type: 'SidebarItem', name: 'Auswertung', route: mainRoute + '/auswertung', icon: ChartBarIcon, disabled: true },
  { type: 'SidebarItem', name: 'Lageplan', route: mainRoute + '/lageplan', icon: MapIcon, disabled: true },
  { type: 'SidebarItem', name: 'Programm', route: mainRoute + '/programm', icon: MegaphoneIcon, disabled: true },
  { type: 'DividerItem', name: 'Verwaltung' },
  { type: 'SidebarItem', name: 'Gliederungen', route: '/verwaltung/gliederungen', icon: MapPinIcon },
  {
    type: 'SidebarItem',
    name: 'Veranstaltungen',
    route: '/verwaltung/veranstaltung',
    icon: CalendarDaysIcon,
    badge: 'Neu',
  },
  { type: 'SidebarItem', name: 'Benutzer:innen', route: '/verwaltung/benutzer', icon: UsersIcon },
  { type: 'SidebarItem', name: 'Orte', route: '/verwaltung/orte', icon: GlobeEuropeAfricaIcon },
  { type: 'DividerItem', name: 'Entwicklung' },
  { type: 'SidebarItem', name: 'Komponenten', route: '/develeopment/components', icon: CubeIcon },
  // { name: 'Unterbringung', route: '', icon: HomeIcon },
  // { name: 'Finanzen', route: '', icon: BanknotesIcon },
]
</script>

<template>
  <div class="h-full flex flex-col pr-6 text-primary-900 font-medium">
    <!-- Sidebar Header -->
    <div class="flex items-center p-2 space-x-3 rounded-xl bg-primary-500 my-4">
      <div class="shrink-0 h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          class="h-5 aspect-square text-primary-500"
          fill="currentColor"
        >
          <path
            d="M278.9 2.8c5.5-3.8 12.7-3.8 18.2 0L517.3 154.7c11.3 7.8 18.7 20 20.4 33.6L571.4 458c3.6 28.6-18.8 54-47.6 54H52.2C23.4 512 1 486.7 4.6 458L38.3 188.2c1.7-13.6 9.1-25.8 20.4-33.6L278.9 2.8zM76.9 181c-3.8 2.6-6.2 6.7-6.8 11.2L36.4 462c-1.2 9.5 6.3 18 15.9 18H272V46.5L76.9 181zM405.4 480L304 288.4V480H405.4zm36.2 0h82.1c9.6 0 17.1-8.4 15.9-18L505.9 192.2c-.6-4.5-3-8.6-6.8-11.2L304 46.5V220L441.6 480z"
          />
        </svg>
      </div>
      <div class="grow text-white leading-3">
        <div class="text-sm font-normal text-primary-200">Veranstaltung</div>
        <div>Brahmsee</div>
      </div>
    </div>

    <!-- Sidebar Item List -->
    <SidebarItems
      :navigation="navigation"
      class="grow"
    />

    <!-- User Management -->
    <div class="flex items-center space-x-3 py-4 border-t border-gray-300">
      <img
        class="h-8 aspect-square rounded-full bg-green-700 shrink-0"
        :src="personProfileImage(loggedInAccount)"
        alt=""
      />
      <div class="grow text-sm">Moin, {{ loggedInAccount?.person.firstname }}</div>
      <button
        type="button"
        class="shrink-0 flex items-center justify-center h-8 aspect-square"
        @click="logout"
      >
        <ArrowRightOnRectangleIcon class="h-5 aspect-square" />
      </button>
    </div>
  </div>
</template>
