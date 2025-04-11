<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<Props>()

type Abbr = {
  short: string
  long: string
}

const abbreviations = {
  faq: {
    short: 'FAQ',
    long: 'Frequently Asked Questions',
  },
} as const satisfies Record<string, Abbr>

type Props = {
  abbr: keyof typeof abbreviations
}

const abbr = computed(() => abbreviations[props.abbr])
</script>

<template>
  <abbr :title="abbr.long">{{ abbr.short }}</abbr>
</template>
