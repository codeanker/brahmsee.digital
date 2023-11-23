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

      <form class="md:col-span-2">
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
              v-model="firstname"
              label="Vorname"
              name="firstname"
              class=""
            />
          </div>

          <div class="sm:col-span-3">
            <BasicInput
              v-model="lastname"
              label="Nachname"
              name="lastname"
              class=""
            />
          </div>

          <div class="sm:col-span-3">
            <BasicDatepicker
              v-model="birthdate"
              label="Geburtsdatum"
              name="birthdate"
              class=""
            />
          </div>

          <div class="sm:col-span-3">
            <BasicInput
              v-model="age"
              label="Alter"
              name="age"
              class=""
            />
          </div>

          <div class="col-span-full">
            <BasicInput
              v-model="email"
              label="Email"
              name="email"
              class=""
              type="email"
            />
          </div>

          <div class="col-span-full">
            <label
              for="username"
              class="block text-sm font-medium leading-6"
              >Username</label
            >
            <div class="mt-2">
              <div
                class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
              >
                <span class="flex select-none items-center pl-3 text-gray-400 sm:text-sm">example.com/</span>
                <input
                  id="username"
                  type="text"
                  name="username"
                  autocomplete="username"
                  class="flex-1 border-0 bg-transparent py-1.5 pl-1 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="janesmith"
                />
              </div>
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="timezone"
              class="block text-sm font-medium leading-6"
              >Timezone</label
            >
            <div class="mt-2">
              <select
                id="timezone"
                name="timezone"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
              >
                <option>Pacific Standard Time</option>
                <option>Eastern Standard Time</option>
                <option>Greenwich Mean Time</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-8 flex">
          <Button color="secondary"> Speichern</Button>
        </div>
      </form>
    </div>

    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Change password</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">Update your password associated with your account.</p>
      </div>

      <form class="md:col-span-2">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div class="col-span-full">
            <label
              for="current-password"
              class="block text-sm font-medium leading-6"
              >Current password</label
            >
            <div class="mt-2">
              <input
                id="current-password"
                name="current_password"
                type="password"
                autocomplete="current-password"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="new-password"
              class="block text-sm font-medium leading-6"
              >New password</label
            >
            <div class="mt-2">
              <input
                id="new-password"
                name="new_password"
                type="password"
                autocomplete="new-password"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="confirm-password"
              class="block text-sm font-medium leading-6"
              >Confirm password</label
            >
            <div class="mt-2">
              <input
                id="confirm-password"
                name="confirm_password"
                type="password"
                autocomplete="new-password"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex">
          <Button color="secondary">Speichern</Button>
        </div>
      </form>
    </div>

    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Log out other sessions</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
          Please enter your password to confirm you would like to log out of your other sessions across all of your
          devices.
        </p>
      </div>

      <form class="md:col-span-2">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div class="col-span-full">
            <label
              for="logout-password"
              class="block text-sm font-medium leading-6"
              >Your password</label
            >
            <div class="mt-2">
              <input
                id="logout-password"
                name="password"
                type="password"
                autocomplete="current-password"
                class="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex">
          <Button color="warning"> Andere Sitzungen abmelden</Button>
        </div>
      </form>
    </div>

    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Delete account</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
          No longer want to use our service? You can delete your account here. This action is not reversible. All
          information related to this account will be deleted permanently.
        </p>
      </div>

      <form class="flex items-start md:col-span-2">
        <Button color="danger"> Ja, meinen Account löschen </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
// import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
// import {
//   ChartBarSquareIcon,
//   Cog6ToothIcon,
//   FolderIcon,
//   GlobeAltIcon,
//   ServerIcon,
//   SignalIcon,
//   XMarkIcon,
// } from '@heroicons/vue/24/outline'

import { ref } from 'vue'

import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/Button.vue'

// const navigation = [
//   { name: 'Projects', href: '#', icon: FolderIcon, current: false },
//   { name: 'Deployments', href: '#', icon: ServerIcon, current: false },
//   { name: 'Activity', href: '#', icon: SignalIcon, current: false },
//   { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
//   { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
//   { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true },
// ]
// const teams = [
//   { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
//   { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
//   { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
// ]
const secondaryNavigation = [
  { name: 'Account', href: '#', current: true },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Billing', href: '#', current: false },
  { name: 'Teams', href: '#', current: false },
  { name: 'Integrations', href: '#', current: false },
]

// demo
const firstname = ref('Max')
const lastname = ref('Mustermann')
const birthdate = ref('07.03.2000')
const age = ref('21')
const email = ref('')
</script>
