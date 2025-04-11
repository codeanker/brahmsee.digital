<script setup lang="ts">
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

import { computePasswordLevel, isStrongPassword } from '@codeanker/helpers'

const props = defineProps<{
  password: string
}>()

const level = computed(() => computePasswordLevel(props.password))
const isValid = computed(() => isStrongPassword(props.password))

defineExpose({ isValid })
</script>

<template>
  <p>Passwortanforderungen</p>

  <p class="text-sm opacity-50"><b>Tipp</b>: Nutze einen Passwortmanager wie KeepassXC für starke Passwörter.</p>

  <div class="grid grid-cols-5 gap-2 mb-2 w-full">
    <div
      v-for="i in 5"
      :key="'level' + i"
      class="rounded-full h-2 bg-gray-200 dark:bg-gray-800 relative overflow-hidden"
    >
      <div
        class="h-2 bg-primary-500 absolute left-0 top-0 w-full transform transition-transform duration-500"
        :class="{
          'translate-x-0': level >= i,
          '-translate-x-full': level < i,
        }"
      />
    </div>
  </div>
  <div class="flex flex-col space-y-2 text-sm mb-4">
    <div
      class="flex items-center space-x-2"
      :class="level >= 1 ? 'text-primary-500' : 'opacity-50'"
    >
      <component
        :is="level >= 1 ? CheckIcon : XMarkIcon"
        class="h-5"
      />
      <p class="mb-0">Mindestens 8 Zeichen</p>
    </div>
    <div
      class="flex items-center space-x-2"
      :class="level >= 2 ? 'text-primary-500' : 'opacity-50'"
    >
      <component
        :is="level >= 2 ? CheckIcon : XMarkIcon"
        class="h-5"
      />
      <p class="mb-0">Kleinbuchstaben</p>
    </div>
    <div
      class="flex items-center space-x-2"
      :class="level >= 3 ? 'text-primary-500' : 'opacity-50'"
    >
      <component
        :is="level >= 3 ? CheckIcon : XMarkIcon"
        class="h-5"
      />
      <p class="mb-0">Großbuchstaben</p>
    </div>
    <div
      class="flex items-center space-x-2"
      :class="level >= 4 ? 'text-primary-500' : 'opacity-50'"
    >
      <component
        :is="level >= 4 ? CheckIcon : XMarkIcon"
        class="h-5"
      />
      <p class="mb-0">Sollte Nummern enthalten</p>
    </div>
    <div
      class="flex items-center space-x-2"
      :class="level >= 5 ? 'text-primary-500' : 'opacity-50'"
    >
      <component
        :is="level >= 5 ? CheckIcon : XMarkIcon"
        class="h-5"
      />
      <p class="mb-0">Sollte Sonderzeichen enthalten</p>
    </div>
  </div>
</template>
