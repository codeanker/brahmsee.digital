<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'

const route = useRoute()

type MetaBreadcrumb = {
  text: string
  to?: RouteLocationRaw
}

const breadcrumbs = computed(() => {
  const mergedBreadcrumbs = route.matched
    .map((route) => {
      if (!route.meta.breadcrumbs) return []
      const metaBreadcrumbs = route.meta.breadcrumbs as MetaBreadcrumb[]
      return metaBreadcrumbs
    })
    .filter((breadcrumb) => {
      return breadcrumb !== undefined && breadcrumb !== null
    })
    .flat()
  return mergedBreadcrumbs
})
</script>

<template>
  <div class="hidden lg:flex items-center text-primary-500 text-sm">
    <HomeIcon class="w-4 h-4 mr-1"></HomeIcon>
    <template v-for="(breadcrumb, index) of breadcrumbs">
      <RouterLink
        v-if="breadcrumb.to"
        :key="breadcrumb.text"
        :to="breadcrumb.to"
      >
        {{ breadcrumb.text }}
      </RouterLink>
      <template v-else>{{ breadcrumb.text }}</template>
      <template v-if="index !== breadcrumbs.length - 1">
        <ChevronRightIcon
          :key="breadcrumb.text"
          class="w-4 h-4 stroke-primary-500"
        />
      </template>
    </template>
  </div>
</template>
