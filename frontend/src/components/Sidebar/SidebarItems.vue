<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-green-700 px-6">
    <router-link :to="{ name: 'Dashboard' }">
      <div class="flex h-16 shrink-0 items-center space-x-4">
        <i class="fa-sharp fa-light fa-tent fa-xl w-auto text-white"></i>
        <div class="font-bold uppercase text-white">Brahmsee</div>
      </div>
    </router-link>
    <nav class="flex flex-1 flex-col">
      <ul
        role="list"
        class="flex flex-1 flex-col gap-y-7"
      >
        <li>
          <ul
            role="list"
            class="-mx-2 space-y-1"
          >
            <li
              v-for="item in navigation"
              :key="item.name"
            >
              <router-link
                :to="{ path: item.route }"
                :class="[
                  item.current ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700 hover:text-white',
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                ]"
              >
                <Component
                  :is="item.icon"
                  :class="[item.current ? 'text-white' : 'text-green-200 group-hover:text-white', 'h-6 w-6 shrink-0']"
                  aria-hidden="true"
                />
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <div class="text-xs font-semibold leading-6 text-green-200">Einstellungen</div>
          <ul
            role="list"
            class="-mx-2 mt-2 space-y-1"
          >
            <li
              v-for="team in teams"
              :key="team.name"
            >
              <router-link
                :to="{ path: team.route }"
                :class="[
                  team.current ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700 hover:text-white',
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                ]"
              >
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-green-400 bg-green-500 text-[0.625rem] font-medium text-white"
                  >{{ team.initial }}</span
                >
                <span class="truncate">{{ team.name }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface SidebarItem {
  name: string
  route: string
  current: boolean
}

export interface NavItem extends SidebarItem {
  icon: Component
}

export interface TeamItem extends SidebarItem {
  id: number
  initial: string
}

interface Props {
  navigation: NavItem[]
  teams: TeamItem[]
}

defineProps<Props>()
</script>
