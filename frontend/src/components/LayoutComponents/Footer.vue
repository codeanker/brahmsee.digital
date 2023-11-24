<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-100 text-sm">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <p class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 lg:mt-0 lg:text-right">
          Copyright &copy; {{ year }}. All rights reserved.
        </p>
        <div class="flex justify-center text-teal-600 sm:justify-start">
          <img
            src="/codeanker.png"
            class="h-4"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
