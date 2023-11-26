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
  BookOpenIcon,
} from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import SidebarItems, { type DividerItem, type SidebarItem } from './SidebarItems.vue'
import SidebarVeranstaltungSwitcher from './SidebarVeranstaltungSwitcher.vue'

import { logout, loggedInAccount } from '@/composables/useAuthentication'
import personProfileImage from '@/helpers/personProfileImage'

const route = useRoute()

let veranstaltungId = ref(parseInt(route.params.veranstaltungId as string))
const mainRoute = computed(() => '/veranstaltung/' + veranstaltungId.value)

function setVeranstaltung(id: number) {
  veranstaltungId.value = id
}

const navigation = computed<Array<SidebarItem | DividerItem>>(() => [
  { type: 'SidebarItem', name: 'Dashboard', route: mainRoute.value + '/dashboard', icon: RocketLaunchIcon },
  {
    type: 'SidebarItem',
    name: 'Anmeldungen',
    route: mainRoute.value + '/anmeldungen',
    icon: UserGroupIcon,
    showChildren: false,
    children: [
      {
        type: 'SidebarItem',
        name: 'CREW',
        route: mainRoute.value + '/anmeldungen/crew',
        icon: UserGroupIcon,
        disabled: true,
      },
      {
        type: 'SidebarItem',
        name: 'Gliederungen',
        route: mainRoute.value + '/anmeldungen/gliederungen',
        icon: UserGroupIcon,
        disabled: true,
      },
      {
        type: 'SidebarItem',
        name: 'Teilnehmende',
        route: mainRoute.value + '/anmeldungen/teilnehmende',
        icon: UserGroupIcon,
      },
    ],
  },
  {
    type: 'SidebarItem',
    name: 'Auswertung',
    route: mainRoute.value + '/auswertung',
    icon: ChartBarIcon,
    disabled: true,
  },
  { type: 'SidebarItem', name: 'Lageplan', route: mainRoute.value + '/lageplan', icon: MapIcon, disabled: true },
  { type: 'SidebarItem', name: 'Programm', route: mainRoute.value + '/programm', icon: MegaphoneIcon, disabled: true },
  { type: 'DividerItem', name: 'Verwaltung' },
  { type: 'SidebarItem', name: 'Gliederungen', route: '/verwaltung/gliederungen', icon: MapPinIcon },
  {
    type: 'SidebarItem',
    name: 'Veranstaltungen',
    route: '/verwaltung/veranstaltung/liste',
    icon: CalendarDaysIcon,
    badge: 'Neu',
  },
  { type: 'SidebarItem', name: 'Personen', route: '/verwaltung/persons', icon: UsersIcon },
  { type: 'SidebarItem', name: 'Orte', route: '/verwaltung/orte', icon: GlobeEuropeAfricaIcon },
  { type: 'DividerItem', name: 'Entwicklung' },
  { type: 'SidebarItem', name: 'Komponenten', route: '/development/components', icon: CubeIcon },
  { type: 'SidebarItem', name: 'Dokumentation', route: 'http://127.0.0.1:5173/', icon: BookOpenIcon },
  // { name: 'Unterbringung', route: '', icon: HomeIcon },
  // { name: 'Finanzen', route: '', icon: BanknotesIcon },
])
</script>

<template>
  <div class="h-full flex flex-col text-primary-900 font-medium">
    <!-- Sidebar Header -->
    <SidebarVeranstaltungSwitcher @set-veranstaltung="setVeranstaltung" />

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
