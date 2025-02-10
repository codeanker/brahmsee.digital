<script setup lang="ts">
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

defineProps<{
  icon: string
  title: string
  action: () => void
  isActive?: () => boolean
}>()
</script>

<template>
  <button
    class="menu-item"
    type="button"
    :class="{ 'is-active': isActive ? isActive() : null }"
    :title="title"
    @click="action"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<style lang="scss">
.menu-item {
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  height: 1.75rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
  width: 1.75rem;

  @apply text-black dark:text-gray-100;

  svg {
    fill: currentColor;
    height: 100%;
    width: 100%;
  }

  &.is-active,
  &:hover {
    @apply text-primary-600;
  }
}
</style>
