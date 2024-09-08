<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, ref, type FunctionalComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'

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

const emit = defineEmits<{
  changeTabIndex: [number]
}>()

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

const selectedTab = ref()

function changeTab(index) {
  selectedTab.value = index
  router.push({ query: { tab: index.toString() } })
  emit('changeTabIndex', index)
}
</script>

<template>
  <BasicDropdown
    :right="false"
    :append="true"
    class="w-full z-[11]"
    button-style="w-full min-w-52 text-left md:hidden"
  >
    <template #buttonContent>
      <button
        type="button"
        class="input-style w-full text-left flex justify-between items-center"
      >
        <div class="flex space-x-2 items-center">
          <component
            :is="tabs[selectedTab || currentindex].icon"
            class="'-ml-0.5 mr-1.5 h-5 w-5'"
            aria-hidden="true"
          />
          <span>{{ tabs[selectedTab || currentindex].name }}</span>
        </div>

        <ChevronDownIcon class="h-5 text-gray-500" />
      </button>
    </template>
    <template #dropdownContent>
      <MenuItem
        as="div"
        class=""
      >
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          type="button"
          class="hover:bg-primary-50 dark:hover:bg-slate-950 rounded items-center flex py-2 px-4 w-full space-x-2 text-left"
          @click="changeTab(index)"
        >
          <div class="flex space-x-2 items-center">
            <component
              :is="tab.icon"
              class="'-ml-0.5 mr-1.5 h-5 w-5'"
              aria-hidden="true"
            />
            <div>{{ tab.name }}</div>
          </div>
        </button>
      </MenuItem>
    </template>
  </BasicDropdown>
  <TabGroup
    as="div"
    :default-index="currentindex"
    :selected-index="selectedTab"
    @change="changeTab"
  >
    <TabList
      class="hidden md:flex border-b border-gray-300 dark:border-gray-700 -mb-px space-x-5"
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
                ? 'bg-gray-100 dark:bg-primary-900 text-primary-600'
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
