<script setup lang="ts">
import type { Component } from 'vue'

export interface SidebarItem {
  type: 'SidebarItem'
  name: string
  icon: Component
  route: string
  children?: SidebarItem[]
  current: boolean
}

export interface DividerItem {
  type: 'DividerItem'
  name: string
}

defineProps<{
  navigation: Array<SidebarItem | DividerItem>
}>()
</script>

<template>
  <div class="flex flex-col">
    <template v-for="item in navigation">
      <div
        v-if="item.type === 'SidebarItem'"
        :key="item.name"
        class="flex flex-col p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all"
      >
        <div class="flex items-center space-x-3">
          <component
            :is="item.icon"
            class="h-5 aspect-square"
          />
          <div class="grow text-sm">{{ item.name }}</div>
        </div>
      </div>
      <div
        v-else
        :key="item.name + item.type"
        class="pt-8 pb-1"
      >
        <div class="text-xs font-bold">{{ item.name }}</div>
      </div>
    </template>
  </div>
</template>
