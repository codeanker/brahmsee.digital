<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels } from '@headlessui/vue'
import type { FunctionalComponent } from 'vue'

withDefaults(
  defineProps<{
    tabs: {
      name: string
      icon: FunctionalComponent
      count?: number
    }[]
    contentSpace?: string
    defaultIndex?: number
  }>(),
  {
    contentSpace: '1',
    type: 'register-cards',
    defaultIndex: 0,
  }
)
</script>

<template>
  <TabGroup
    as="div"
    :default-index="defaultIndex"
  >
    <TabList
      class="border-b border-gray-300 -mb-px flex space-x-5"
      as="div"
      :class="[`mb-${contentSpace}`]"
    >
      <Tab
        v-for="(tab, index) in tabs"
        v-slot="{ selected }"
        :key="index + tab.name"
        class="outline-none"
      >
        <div
          class="text-sm cursor-pointer outline-none -mb-px rounded-t border-b-2 py-2 px-3 hover:text-primary-600 flex items-center"
          :class="[selected ? 'text-primary-600 border-primary-600 ' : 'text-gray-500 border-transparent']"
        >
          <component
            :is="tab.icon"
            class="'-ml-0.5 mr-1.5 h-5 w-5'"
            aria-hidden="true"
          />
          <span></span>
          {{ tab.name }}
          <span
            v-if="tab.count"
            :class="[
              selected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-900',
              'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block',
            ]"
            >{{ tab.count }}</span
          >
        </div>
      </Tab>
    </TabList>
    <TabPanels>
      <slot></slot>
    </TabPanels>
  </TabGroup>
</template>
