<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: string | RouteLocationRaw
  activeClass?: string
  inactiveClass?: string
}>()
</script>

<template>
  <a
    v-if="typeof to === 'string' && to.startsWith('http')"
    v-bind="$attrs"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
  </a>
  <router-link
    v-else
    :to="to"
    :active-class="activeClass"
    :inactive-class="inactiveClass"
  >
    <slot />
  </router-link>
</template>
