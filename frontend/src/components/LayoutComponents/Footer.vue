<script setup lang="ts">
let version = import.meta.env.VITE_APP_VERSION || 'unknown'
let commitHash = import.meta.env.VITE_APP_COMMIT_HASH || 'unknown'
</script>

<template>
  <footer class="text-sm text-center mt-5">
    <div class="w-full text-center mb-3 text-sm leading-snug opacity-50">
      Made with <span class="text-primary-700">♥︎</span> in Germany · Supported by
      <a
        class="underline"
        href="https://codeanker.de/"
        rel="noreferrer"
        >CODEANKER</a
      >
      (v{{ version }}#{{ commitHash }})
    </div>
  </footer>
</template>
