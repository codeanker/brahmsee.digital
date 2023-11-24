<script setup lang="ts">
defineProps<{
  errorMessage?: string
}>()
</script>

<template>
  <Transition name="shake">
    <div
      v-if="errorMessage"
      class="text-danger-500 mb-0 mt-1 text-sm"
    >
      {{ errorMessage }}
    </div>
  </Transition>
  <!-- Das Feld {{ fieldName }} ist ein Pflichtfeld. -->
</template>

<style lang="scss" scoped>
.shake-enter-active {
  animation: shake 0.5s;
}

@keyframes shake {
  8%,
  41% {
    -webkit-transform: translateX(-10px);
  }

  25%,
  58% {
    -webkit-transform: translateX(10px);
  }

  75% {
    -webkit-transform: translateX(-5px);
  }

  92% {
    -webkit-transform: translateX(5px);
  }

  0%,
  100% {
    -webkit-transform: translateX(0);
  }
}
</style>
