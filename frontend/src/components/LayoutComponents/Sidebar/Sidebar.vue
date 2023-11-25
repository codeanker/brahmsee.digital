<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  MapIcon,
  MegaphoneIcon,
  UsersIcon,
  MapPinIcon,
  GlobeEuropeAfricaIcon,
  CubeIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline'

import SidebarItems, { type DividerItem, type SidebarItem } from './SidebarItems.vue'

import { logout, loggedInAccount } from '@/composables/useAuthentication'
import personProfileImage from '@/helpers/personProfileImage'

let mainRoute = '/veranstaltung/1'

const navigation: Array<SidebarItem | DividerItem> = [
  { type: 'SidebarItem', name: 'Dashboard', route: '/dashboard', icon: HomeIcon },
  {
    type: 'SidebarItem',
    name: 'Anmeldungen',
    route: mainRoute + '/anmeldungen',
    icon: UserGroupIcon,
    children: [
      {
        type: 'SidebarItem',
        name: 'CREW',
        route: mainRoute + '/anmeldungen/crew',
        icon: UserGroupIcon,
      },
      {
        type: 'SidebarItem',
        name: 'Gliederungen',
        route: mainRoute + '/anmeldungen/gliederungen',
        icon: UserGroupIcon,
      },
      {
        type: 'SidebarItem',
        name: 'Teilnehmende',
        route: mainRoute + '/anmeldungen/teilnehmende',
        icon: UserGroupIcon,
      },
    ],
  },
  { type: 'SidebarItem', name: 'Auswertung', route: mainRoute + '/auswertungen', icon: ChartBarIcon },
  { type: 'SidebarItem', name: 'Lageplan', route: mainRoute + '/auswertungen', icon: MapIcon },
  { type: 'SidebarItem', name: 'Programm', route: mainRoute + '/programm', icon: MegaphoneIcon },
  { type: 'DividerItem', name: 'Verwaltung' },
  { type: 'SidebarItem', name: 'Gliederungen', route: '/verwaltung/gliederungen', icon: MapPinIcon },
  {
    type: 'SidebarItem',
    name: 'Veranstaltungen',
    route: '/verwaltung/veranstaltung',
    icon: CalendarDaysIcon,
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
    <div class="flex items-center py-4 space-x-3 text-primary-500">
      <div class="uppercase font-bold grow">Brahmsee.digital</div>
      <button
        type="button"
        class="shrink-0 flex items-center justify-center h-8 aspect-square"
      >
        <MagnifyingGlassIcon class="h-5 aspect-square text-primary-950" />
      </button>
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
