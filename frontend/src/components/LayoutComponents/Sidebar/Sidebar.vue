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
import SidebarVeranstaltungSwitcher from './SidebarVeranstaltungSwitcher.vue'

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
  { type: 'SidebarItem', name: 'Dokumentation', route: 'http://127.0.0.1:5173/', icon: CubeIcon },
  // { name: 'Unterbringung', route: '', icon: HomeIcon },
  // { name: 'Finanzen', route: '', icon: BanknotesIcon },
]
</script>

<template>
  <div class="h-full flex flex-col text-primary-900 font-medium">
    <!-- Sidebar Header -->
    <SidebarVeranstaltungSwitcher />

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
