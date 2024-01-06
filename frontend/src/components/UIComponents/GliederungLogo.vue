<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
}>()

const formattedName = computed(() => {
  return props.name
    .split(' ')
    .map((word) => (word === 'Ortsgruppe' || word === 'e.V.' ? ' ' : word))
    .join(' ')
})
</script>

<template>
  <div class="flex items-center h-12 lg:h-16 space-x-2.5">
    <img
      src="@/assets/images/dlrg-jugend-vollfarbe.svg"
      class="h-full"
    />
    <div class="h-3/4 border-r-2 border-black rounded-full" />
    <div class="text-black text-xl flex flex-col leading-6 mulish">
      <div>DLRG-Jugend</div>
      <div>{{ formattedName }}</div>
    </div>
  </div>
</template>

<style scoped>
.mulish {
  font-family: 'Mulish', sans-serif;
}
</style>
