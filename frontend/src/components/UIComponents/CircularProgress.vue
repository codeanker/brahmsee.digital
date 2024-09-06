<!-- https://www.30secondsofcode.org/css/s/circular-progress-bar/ -->

<!-- eslint-disable vue/no-unused-properties -->

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    progress: number
    size: number
    strokeWidth: number
    formatter: (value: number) => string
  }>(),
  {
    progress: 0,
    size: 150,
    strokeWidth: 15,
    formatter: (value: number) => value.toString(),
  }
)

const pxSize = computed(() => `${props.size}px`)
const pxStroke = computed(() => `${props.strokeWidth}px`)
</script>

<template>
  <div class="relative">
    <svg
      :width="props.size"
      :height="props.size"
      :viewBox="`0 0 ${props.size} ${props.size}`"
      class="mx-auto circular-progress"
      :style="{ '--progress': props.progress }"
    >
      <circle class="bg"></circle>
      <circle class="fg"></circle>
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <p class="font-semibold text-xl text-center mb-0">{{ props.formatter(props.progress) }} %</p>
    </div>
  </div>
</template>

<style>
@property --progress {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.circular-progress {
  --size: v-bind(pxSize);
  --half-size: calc(var(--size) / 2);
  --stroke-width: v-bind(pxStroke);
  --radius: calc((var(--size) - var(--stroke-width)) / 2);
  --circumference: calc(var(--radius) * pi * 2);
  --dash: calc((var(--progress) * var(--circumference)) / 100);
}

.circular-progress circle {
  cx: var(--half-size);
  cy: var(--half-size);
  r: var(--radius);
  stroke-width: var(--stroke-width);
  fill: none;
  stroke-linecap: round;
}

.circular-progress circle.bg {
  stroke: #ddd;
}

.circular-progress circle.fg {
  transform: rotate(-90deg);
  transform-origin: var(--half-size) var(--half-size);
  stroke-dasharray: var(--dash) calc(var(--circumference) - var(--dash));
  transition: stroke-dasharray 0.3s linear 0s;
  @apply stroke-primary-600;
}
</style>
