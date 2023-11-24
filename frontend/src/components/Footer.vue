<script setup lang="ts">
let version = '0.0.0'
let commitHash = '0000000'
</script>

<template>
  <footer class="text-sm text-center">
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
