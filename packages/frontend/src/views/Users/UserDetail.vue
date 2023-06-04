<template>
  <header class="border-b border-white/5">
    <!-- Secondary navigation -->
    <nav class="flex overflow-x-auto py-4">
      <ul
        role="list"
        class="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
      >
        <li
          v-for="item in secondaryNavigation"
          :key="item.name"
        >
          <a
            :href="item.href"
            :class="item.current ? 'text-indigo-400' : ''"
            >{{ item.name }}</a
          >
        </li>
      </ul>
    </nav>
  </header>

  <!-- Settings forms -->
  <div class="divide-y divide-white/5">
    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Profil Informationen</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">Hier kannst Du deine Profil Informationen bearbeiten.</p>
      </div>

      <div class="md:col-span-2">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div class="col-span-full flex items-center gap-x-8">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
              class="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
            />
          </div>

          <div class="sm:col-span-3">
            <BasicInput
              label="Vorname"
              name="firstname"
              required
            />
          </div>

          <div class="sm:col-span-3">
            <BasicInput
              label="Nachname"
              name="lastname"
              required
            />
          </div>

          <div class="sm:col-span-3">
            <BasicDatepicker
              label="Geburtsdatum"
              name="birthdate"
              required
            />
          </div>

          <div class="sm:col-span-3">
            <BasicSelect
              label="Geschlecht"
              name="sex"
              :options="[
                {
                  label: 'männlich',
                  value: 'male',
                },
                {
                  label: 'weiblich',
                  value: 'female',
                },
                {
                  label: 'Divers',
                  value: 'divers',
                },
              ]"
            />
          </div>

          <div class="col-span-full">
            <BasicInput
              label="Email"
              name="email"
              type="email"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Passwort ändern</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">Hier kannst Du dein Passwort ändern.</p>
      </div>

      <form class="md:col-span-2">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div class="col-span-full">
            <BasicPassword
              label="Aktuelles Passwort"
              required
            />
          </div>

          <div class="col-span-full">
            <BasicPassword
              label="Neues Passwort"
              required
            />
          </div>

          <div class="col-span-full">
            <BasicPassword
              label="Passwort bestätigen"
              required
            />
          </div>
        </div>

        <div class="mt-8 flex">
          <button
            type="submit"
            class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>

    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Account löschen</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
          Du benötigst diesen Account nicht mehr? Hier kannst Du das Konto löschen. Dieser Vorgang ist nicht rückgängig
          zu machen. Alle Informationen, die mit diesem Konto verbunden sind, werden dauerhaft gelöscht.
        </p>
      </div>

      <form class="flex items-start md:col-span-2">
        <button
          type="submit"
          class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
        >
          Ja, diesen Account löschen
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import BaseLayout from '@/layouts/BaseLayout.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'

import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'

const navigation = [
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: false },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
  { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true },
]
const teams = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
  { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
]
const secondaryNavigation = [
  { name: 'Account', href: '#', current: true },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Billing', href: '#', current: false },
  { name: 'Teams', href: '#', current: false },
  { name: 'Integrations', href: '#', current: false },
]
</script>
