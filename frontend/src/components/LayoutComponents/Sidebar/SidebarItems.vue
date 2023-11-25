<script setup lang="ts">
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  navigation: Array<SidebarItem | DividerItem>
}>()

const route = useRoute()

export interface SidebarItem {
  type: 'SidebarItem'
  name: string
  icon: Component
  route: string
  children?: SidebarItem[]
  showChildren?: boolean
}

export interface DividerItem {
  type: 'DividerItem'
  name: string
}

const isCurrentRoute = (path: string) => {
  return path === route.path
}
</script>

<template>
  <div class="flex flex-col">
    <template v-for="item in navigation">
      <div
        v-if="item.type === 'SidebarItem'"
        :key="item.name"
        class="flex flex-col"
      >
        <router-link
          :to="item.route"
          class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
          :class="{
            'text-primary-500': isCurrentRoute(item.route),
          }"
        >
          <component
            :is="item.icon"
            class="h-5 aspect-square"
          />
          <div class="grow text-sm">{{ item.name }}</div>
        </router-link>

        <!-- Children container -->
        <div
          class="flex flex-col relative transition-maxheight overflow-hidden"
          :class="{ open: isCurrentRoute(item.route) }"
        >
          <div
            v-for="child in item.children"
            :key="child.name"
            class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
          >
            <!-- Current indicator -->
            <div class="h-5 aspect-square flex items-center justify-center relative">
              <div
                v-if="isCurrentRoute(child.route)"
                class="rounded-full h-1.5 aspect-square bg-primary-500 absolute z-50"
              ></div>
            </div>
            <router-link
              :to="child.route"
              class="flex items-center text-sm"
              :class="{
                'text-primary-500': isCurrentRoute(child.route),
              }"
            >
              {{ child.name }}
            </router-link>
          </div>
          <!-- side line -->
          <div class="absolute w-5 h-full flex items-center justify-center left-2">
            <div class="rounded-full w-0.5 h-full bg-primary-200"></div>
          </div>
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

<style scoped lang="scss">
.transition-maxheight {
  transition-property: max-height;
  transition-duration: 1s;
  transition-timing-function: ease-in-out;
  max-height: 0;
}

.open {
  max-height: 5000px;
}
</style>
