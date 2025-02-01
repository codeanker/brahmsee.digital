<script setup lang="ts"></script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-dark-primary min-h-full min-h-screen transition-colors duration-200 justify-center sm:px-6 lg:px-8"
  >
    <slot>
      <router-view />
    </slot>
  </div>
</template>
