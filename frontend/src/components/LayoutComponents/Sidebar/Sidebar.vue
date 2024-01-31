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
  PuzzlePieceIcon,
  FingerPrintIcon,
  TicketIcon,
  HandThumbUpIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import SidebarItems, { type DividerItem, type SidebarItem } from './SidebarItems.vue'
import SidebarVeranstaltungSwitcher from './SidebarVeranstaltungSwitcher.vue'

import UserLogo from '@/components/UIComponents/UserLogo.vue'
import { logout, loggedInAccount } from '@/composables/useAuthentication'

const route = useRoute()

const veranstaltungId = computed(() => {
  if (route.params.veranstaltungId !== undefined && typeof route.params.veranstaltungId === 'string') {
    return parseInt(route.params.veranstaltungId)
  }
  const letzteVeranstaltung = localStorage.getItem('letzteVeranstaltung')
  if (letzteVeranstaltung !== null) {
    return parseInt(letzteVeranstaltung)
  }
  return undefined
})

const hasPermissionToView = (permission) => {
  return permission.includes(loggedInAccount.value?.role)
}

const navigation = computed<Array<SidebarItem | DividerItem>>(() => [
  {
    type: 'SidebarItem',
    name: 'Dashboard',
    route: { name: 'Dashboard' },
    icon: RocketLaunchIcon,
    disabled: veranstaltungId.value === undefined,
    visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Anmeldungen',
    route: { name: 'VeranstaltungAnmeldung', params: { veranstaltungId: veranstaltungId.value } },
    icon: TicketIcon,
    showChildren: false,
    disabled: veranstaltungId.value === undefined,
    visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
    children: [
      {
        type: 'SidebarItem',
        name: 'CREW',
        route: { name: 'VeranstaltungAnmeldungenCrew', params: { veranstaltungId: veranstaltungId.value } },
        icon: UserGroupIcon,
        disabled: true,
        visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
      },
      {
        type: 'SidebarItem',
        name: 'Gliederungen',
        route: { name: 'VeranstaltungAnmeldungenGliederungen', params: { veranstaltungId: veranstaltungId.value } },
        icon: UserGroupIcon,
        disabled: true,
        visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
      },
      {
        type: 'SidebarItem',
        name: 'Teilnehmende',
        route: { name: 'VeranstaltungAnmeldungenTeilnehmende', params: { veranstaltungId: veranstaltungId.value } },
        icon: UserGroupIcon,
        disabled: veranstaltungId.value === undefined,
        visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
      },
    ],
  },
  {
    type: 'SidebarItem',
    name: 'Auswertung',
    route: { name: 'VeranstaltungAuswertung', params: { veranstaltungId: veranstaltungId.value } },
    icon: ChartBarIcon,
    disabled: true,
    visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Lageplan',
    route: { name: 'VeranstaltungLageplan', params: { veranstaltungId: veranstaltungId.value } },
    icon: MapIcon,
    disabled: true,
    visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Programm',
    route: { name: 'VeranstaltungProgramm', params: { veranstaltungId: veranstaltungId.value } },
    icon: PuzzlePieceIcon,
    disabled: true,
    visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
  },
  { type: 'DividerItem', name: 'Ausschreibung', visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']) },
  {
    type: 'SidebarItem',
    name: 'Ausschreibungen',
    route: { name: 'UnterveranstaltungList', params: { veranstaltungId: veranstaltungId.value } },
    icon: MegaphoneIcon,
    visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
  },
  { type: 'DividerItem', name: 'Verwaltung', visible: hasPermissionToView(['ADMIN']) },
  {
    type: 'SidebarItem',
    name: 'Accounts',
    route: { name: 'Verwaltung Alle Accounts' },
    icon: FingerPrintIcon,
    visible: hasPermissionToView(['ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Personen',
    route: { name: 'Verwaltung Alle Personen' },
    icon: UsersIcon,
    visible: hasPermissionToView(['ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Veranstaltungen',
    route: { name: 'Verwaltung Alle Veranstaltungen' },
    icon: CalendarDaysIcon,
    visible: hasPermissionToView(['ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Gliederungen',
    route: { name: 'Verwaltung Alle Gliederungen' },
    icon: MapPinIcon,
    visible: hasPermissionToView(['ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Orte',
    route: { name: 'Verwaltung Alle Orte' },
    icon: GlobeEuropeAfricaIcon,
    visible: hasPermissionToView(['ADMIN']),
  },
  { type: 'DividerItem', name: 'Entwicklung', visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']) },
  {
    type: 'SidebarItem',
    name: 'Komponenten',
    route: { name: 'Komponenten' },
    icon: CubeIcon,
    visible: hasPermissionToView(['ADMIN']),
  },
  {
    type: 'SidebarItem',
    name: 'Mitwirkende',
    route: { name: 'Mitwirkende' },
    icon: HandThumbUpIcon,
    visible: hasPermissionToView(['ADMIN', 'GLIEDERUNG_ADMIN']),
  },
])
</script>

<template>
  <div class="h-full flex flex-col text-primary-900 font-medium p-6 pb-0 lg:px-0 lg:pt-12">
    <!-- Sidebar Header -->
    <SidebarVeranstaltungSwitcher />

    <!-- Sidebar Item List -->
    <SidebarItems
      :navigation="navigation"
      class="grow overflow-y-auto"
    />

    <!-- User Management -->
    <div class="flex items-center space-x-3 py-4 border-t border-gray-300">
      <div class="w-10 h-10">
        <UserLogo :name="loggedInAccount?.person.firstname + ' ' + loggedInAccount?.person.lastname" />
      </div>
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
