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
  visible?: boolean
}

export interface DividerItem {
  type: 'DividerItem'
  name: string
  visible?: boolean
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
        <template v-if="!item.disabled && item.visible">
          <AppLink
            :to="item.route"
            class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            active-class="text-primary-600 dark:text-primary-400"
          >
            <component
              :is="item.icon"
              class="inline h-5 aspect-square"
            />
            <div class="grow">
              {{ item.name }}
            </div>
            <!-- Badge -->
            <div
              v-if="item.badge"
              class="inline text-xs uppercase rounded-sm bg-secondary-100 text-secondary-600 px-1 py-0.5"
            >
              {{ item.badge }}
            </div>
          </AppLink>
          <!-- Children container -->
          <div
            v-if="isCurrentRoute(item.route)"
            class="flex flex-col relative overflow-hidden"
          >
            <div
              v-for="child in item.children"
              :key="child.name"
              class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              :class="{
                'cursor-not-allowed': child.disabled,
              }"
            >
              <!-- Current indicator -->
              <div class="h-5 aspect-square flex items-center justify-center relative">
                <div
                  v-if="isCurrentRoute(child.route)"
                  class="rounded-full h-1.5 aspect-square bg-primary-600 dark:bg-primary-400 absolute z-50"
                />
              </div>
              <AppLink
                v-if="!child.disabled && child.visible"
                :to="child.route"
                class="flex items-center text-sm flex-grow"
                active-class="text-primary-600 dark:text-primary-400"
              >
                {{ child.name }}
              </AppLink>
              <div
                v-if="child.disabled && child.visible"
                class="flex items-center text-sm flex-grow cursor-not-allowed"
              >
                {{ child.name }}
              </div>

              <!-- Badge -->
              <div
                v-if="child.badge"
                class="inline text-xs uppercase rounded-sm bg-secondary-100 text-secondary-600 px-1 py-0.5"
              >
                {{ child.badge }}
              </div>
              <!-- Locked / Disabled -->
              <component
                :is="LockClosedIcon"
                v-if="child.disabled"
                class="h-5 aspect-square"
                :class="{
                  'cursor-not-allowed': child.disabled,
                }"
              />
            </div>
            <!-- side line -->
            <div class="absolute w-5 h-full flex items-center justify-center left-2">
              <div class="rounded-full w-0.5 h-full bg-primary-200 dark:bg-gray-300" />
            </div>
          </div>
        </template>
        <template v-if="item.disabled && item.visible">
          <div class="flex items-center space-x-3 p-2 rounded-lg cursor-not-allowed">
            <component
              :is="item.icon"
              class="inline h-5 aspect-square"
            />
            <div class="grow">
              {{ item.name }}
            </div>
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
        v-if="item.type === 'DividerItem' && item.visible"
        :key="item.name + item.type"
        class="pt-8 pb-1"
      >
        <div class="text-xs font-bold">
          {{ item.name }}
        </div>
      </div>
    </template>
  </div>
</template>
