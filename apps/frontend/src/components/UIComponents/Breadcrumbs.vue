<script setup lang="ts">
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() =>
  route.matched
    .map((match) => {
      const metaBreadcrumbs = match.meta.breadcrumbs
      if (!metaBreadcrumbs) return []

      return metaBreadcrumbs
        .map((crumb) => {
          if (typeof crumb === 'function') {
            return crumb(route)
          }

          return crumb
        })
        .map((crumb) => ({
          to: match,
          ...crumb,
        }))
    })
    .filter((breadcrumb) => {
      return breadcrumb !== undefined && breadcrumb !== null
    })
    .flat()
)
</script>

<template>
  <div class="hidden lg:flex items-center text-primary-500 text-sm">
    <RouterLink :to="{ path: '/' }">
      <HomeIcon class="w-4 h-4" />
    </RouterLink>
    <ChevronRightIcon class="w-4 h-4 stroke-primary-500" />

    <template
      v-for="(breadcrumb, index) of breadcrumbs"
      :key="index"
    >
      <RouterLink :to="breadcrumb.to">
        {{ breadcrumb.text }}
      </RouterLink>
      <template v-if="index !== breadcrumbs.length - 1">
        <ChevronRightIcon
          :key="breadcrumb.text"
          class="w-4 h-4 stroke-primary-500"
        />
      </template>
    </template>
  </div>
</template>
