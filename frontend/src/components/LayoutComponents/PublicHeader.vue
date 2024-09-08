<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDownIcon,
  UserCircleIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

import BasicDropdown from '../BasicInputs/BasicDropdown.vue'
import Button from '../UIComponents/Button.vue'

import GliederungLogo from '@/components/UIComponents/GliederungLogo.vue'

interface Gliederung {
  name?: string
}

withDefaults(
  defineProps<{
    gliederung?: Gliederung
    showContactButton?: boolean
    showProfileDropdown?: boolean
  }>(),
  {
    showContactButton: false,
    showProfileDropdown: false,
    gliederung: () => {
      return {
        name: 'Schleswig-Holstein',
      }
    },
  }
)
</script>

<template>
  <div class="flex items-center top-0 sticky bg-white dark:bg-dark-primary z-10 justify-between mb-4 py-6">
    <GliederungLogo :name="gliederung?.name ? gliederung?.name : ''" />
    <Button
      v-if="showContactButton"
      color="secondary"
      title="Kontaktiere uns"
    >
      <ChatBubbleOvalLeftEllipsisIcon class="h-5" />
    </Button>
    <div
      v-if="showProfileDropdown"
      class="flex items-center space-x-4"
    >
      <BasicDropdown>
        <template #buttonContent>
          <Button
            type="button"
            color="secondary"
            class="flex items-center space-x-2"
          >
            <UserCircleIcon class="h-5" />
            <span>Konto</span>
            <ChevronDownIcon class="h-5" />
          </Button>
        </template>
        <template #dropdownContent>
          <MenuItem
            as="div"
            class="border-b pb-1 min-w-80"
          >
            <div class="rounded flex flex-col items-start py-2 px-4 text-left">
              <span>Angemeldet als:</span>
              <span>lukas.hauenstein@pm.me</span>
            </div>
          </MenuItem>
          <MenuItem
            as="div"
            class=""
          >
            <button
              type="button"
              class="hover:bg-primary-50 dark:hover:bg-slate-950 flex items-center space-x-2 py-2 px-4 text-left w-full"
            >
              <TrashIcon class="h-5" />
              <span>Konto & Daten entfernen</span>
            </button>
          </MenuItem>
          <MenuItem
            as="div"
            class=""
          >
            <button
              type="button"
              class="hover:bg-primary-50 dark:hover:bg-slate-950 flex items-center space-x-2 py-2 px-4 text-left w-full"
            >
              <ArrowRightOnRectangleIcon class="h-5" />
              <span>Abmelden</span>
            </button>
          </MenuItem>
        </template>
      </BasicDropdown>
    </div>
  </div>
</template>
