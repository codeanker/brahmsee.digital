<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels } from '@headlessui/vue'
import { computed, type FunctionalComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    tabs: {
      name: string
      icon: FunctionalComponent
      count?: number | undefined
    }[]
    contentSpace?: string
    defaultIndex?: number
  }>(),
  {
    contentSpace: '1',
    type: 'register-cards',
    defaultIndex: undefined,
  }
)

const route = useRoute()
const router = useRouter()

const currentindex = computed(() => {
  if (props.defaultIndex !== undefined) {
    return props.defaultIndex
  }
  if (route.query.tab !== undefined && typeof route.query.tab === 'string') {
    return parseInt(route.query.tab)
  }
  return 0
})

function changeTab(index) {
  router.push({ query: { tab: index.toString() } })
}
</script>

<template>
  <TabGroup
    as="div"
    :default-index="currentindex"
    @change="changeTab"
  >
    <TabList
      class="border-b border-gray-300 dark:border-gray-700 -mb-px flex space-x-5"
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
          class="text-sm cursor-pointer outline-none -mb-px rounded-t border-b-2 py-2 px-3 hover:text-primary-500 flex items-center"
          :class="[selected ? 'text-primary-500 border-primary-500 ' : 'text-gray-500 border-transparent']"
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
              selected
                ? 'bg-gray-100 dark:bg-primary-800 text-primary-600'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-500',
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
