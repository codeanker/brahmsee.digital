<script setup lang="ts">
import { LockClosedIcon } from '@heroicons/vue/24/outline'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

import AppLink from '@/components/AppLink.vue'

export interface SidebarItem {
  type: 'SidebarItem'
  name: string
  icon: Component
  route: SidebarItemRoute
  children?: SidebarItem[]
  showChildren?: boolean
  badge?: string
  disabled?: boolean
}

export interface DividerItem {
  type: 'DividerItem'
  name: string
}

export type SidebarItemRoute =
  | {
      name: string
    }
  | string

defineProps<{
  navigation: Array<SidebarItem | DividerItem>
}>()

const route = useRoute()

function isCurrentRoute(checkRoute: SidebarItemRoute) {
  if (typeof checkRoute === 'string') return false
  return checkRoute.name === route.name || route.matched.some((record) => record.name === checkRoute.name)
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
        <template v-if="!item.disabled">
          <AppLink
            :to="item.route"
            class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
            active-class="text-primary-600"
          >
            <component
              :is="item.icon"
              class="h-5 aspect-square"
            />
            <div class="grow text-sm">{{ item.name }}</div>
            <!-- Badge -->
            <div
              v-if="item.badge"
              class="text-xs uppercase rounded-sm bg-secondary-100 text-secondary-600 px-1 py-0.5"
            >
              {{ item.badge }}
            </div>
          </AppLink>
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
                  class="rounded-full h-1.5 aspect-square bg-primary-600 absolute z-50"
                ></div>
              </div>
              <AppLink
                :to="child.route"
                class="flex items-center text-sm flex-grow"
                active-class="text-primary-600"
                :class="{
                  'cursor-not-allowed': child.disabled,
                }"
              >
                {{ child.name }}
              </AppLink>

              <!-- Badge -->
              <div
                v-if="child.badge"
                class="text-xs uppercase rounded-sm bg-secondary-100 text-secondary-600 px-1 py-0.5"
              >
                {{ child.badge }}
              </div>
              <!-- Locked / Disabled -->
              <component
                :is="LockClosedIcon"
                v-if="child.disabled"
                class="h-5 aspect-square"
              />
            </div>
            <!-- side line -->
            <div class="absolute w-5 h-full flex items-center justify-center left-2">
              <div class="rounded-full w-0.5 h-full bg-primary-200"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center space-x-3 p-2 rounded-lg cursor-not-allowed">
            <component
              :is="item.icon"
              class="h-5 aspect-square"
            />
            <div class="grow text-sm">{{ item.name }}</div>
            <!-- Locked / Disabled -->
            <component
              :is="LockClosedIcon"
              v-if="item.disabled"
              class="h-5 aspect-square"
            />
          </div>
        </template>
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
