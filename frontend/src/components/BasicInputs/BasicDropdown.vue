<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'

withDefaults(
  defineProps<{
    right?: boolean
    buttonStyle?: string
    disabled?: boolean
    label?: string
    name?: string
    id?: string
    required?: boolean
  }>(),
  {
    minWidth: '250',
    right: true,
    appendSeperatorColor: 'black',
    append: false,
    disabled: false,
  }
)
</script>

<template>
  <div class="relative inline">
    <label
      v-if="label"
      class="font-medium"
      :for="id || name || label"
      >{{ label }}
      <span
        v-if="required"
        class="text-danger-600"
        >*</span
      ></label
    >
    <Menu>
      <MenuButton
        class="btn"
        :class="[buttonStyle, { 'hover:cursor-not-allowed': disabled }]"
        :disabled="disabled"
        @click="(e) => e.stopPropagation()"
      >
        <slot name="buttonContent"></slot>
      </MenuButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          :class="{ 'right-0': right }"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          @click="(e) => e.stopPropagation()"
        >
          <slot name="dropdownContent" />
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
