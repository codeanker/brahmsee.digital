<script setup lang="ts">
const version = import.meta.env.VITE_APP_VERSION || '0.0.0'
const commitHash = import.meta.env.VITE_APP_COMMIT_HASH || '000000'
</script>

<template>
  <div class="flex flex-col lg:flex-row items-start justify-center lg:items-center lg:justify-between">
    <img
      class="h-10 mb-5 lg:mb-0"
      src="@/assets/images/gliederung_sh.png"
    />
    <div class="flex flex-col space-y-3 lg:space-y-0 text-sm lg:text-xs text-left lg:text-right leading-4">
      <RouterLink
        class="hover:text-gray-700 transition-all"
        :to="{
          name: 'Impressum',
        }"
        target="_blank"
        rel="noopener noreferrer"
      >
        Impressum
      </RouterLink>
      <RouterLink
        class="hover:text-gray-700 transition-all"
        :to="{
          name: 'Datenschutz',
        }"
        target="_blank"
        rel="noopener noreferrer"
      >
        Datenschutz
      </RouterLink>
      <div>v{{ version }}#{{ commitHash }}</div>
    </div>
  </div>
</template>
