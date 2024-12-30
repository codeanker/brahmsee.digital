<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'

import Button from './CookieAgreementButton.vue'
import Switch from './CookieAgreementSwitch.vue'

const extended = ref(false)
const tabs = ref([
  { name: 'Kategorien', active: true },
  { name: 'Services', active: false },
])
const services = ref([{ name: 'Google Analytics', active: false, category: 'Analyse' }])

const isCategory = computed(() => tabs.value[0]?.active)
</script>

<template>
  <div class="fixed z-50 w-screen h-screen bg-black/40 flex items-center justify-center top-0 left-0">
    <div class="bg-white rounded-lg shadow-xl p-6 w-[600px]">
      <div class="flex justify-between mb-5">
        <div class="flex flex-col">
          <template v-if="!extended">
            <div class="text-xl font-medium">
              Moin Moin,
            </div>
            <div class="text-sm font-medium">
              Diese Website verwendet Cookies
            </div>
          </template>
          <template v-else>
            <div class="flex items-center space-x-2">
              <ChevronLeftIcon
                class="h-8 cursor-pointer"
                @click="extended = !extended"
              />
              <div class="flex flex-col">
                <div class="text-xl font-medium">
                  Cookie-Einstellungen
                </div>
                <div class="text-sm font-medium">
                  Hier können Sie Ihre Einstellungen vornehmen
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="text-5xl">
          🍪
        </div>
      </div>
      <div class="mb-5">
        <template v-if="!extended">
          Wir verwenden Cookies, um den Datenverkehr auf unserer Website zu analysieren und ihre Bedienung zu
          verbessern. Außerdem teilen wir Informationen über Ihre Nutzung unserer Website mit unseren Partnern für
          Analysen, die diese Informationen mit anderen Daten kombinieren können, die Sie bereitgestellt haben oder die
          sie aus Ihrer Nutzung ihrer Dienste erhalten haben.
        </template>
        <template v-else>
          Hier können Sie verschiedene Tags, Tracker und Analyse-Tools, die auf dieser Website verwendet werden,
          auswählen und ausschalten.
          <div class="grid grid-cols-2 gap-5 my-5">
            <Button
              v-for="tab in tabs"
              :key="tab.name"
              color="transparent"
              class="justify-center rounded-none text-gray-500 hover:text-green-600"
              :class="{ 'border-b-2 border-green-600 font-semibold text-green-600': tab.active }"
              @click="
                () => {
                  tabs.forEach((tab) => (tab.active = false))
                  tab.active = true
                }
              "
            >
              {{ tab.name }}
            </Button>
          </div>
          <div class="grid grid-flow-row">
            <div
              v-for="service in services"
              :key="service.name"
              class="bg-gray-100 rounded-lg flex items-center p-3"
            >
              <div
                v-if="isCategory"
                class="grow flex flex-col"
              >
                {{ service.category }}
                <div class="text-sm font-medium text-gray-500">
                  {{ service.category }}
                </div>
              </div>
              <div
                v-else
                class="grow flex flex-col"
              >
                {{ service.name }}
                <div class="text-sm font-medium text-gray-500">
                  {{ service.category }}
                </div>
              </div>
              <Switch v-model="service.active" />
            </div>
          </div>
        </template>
      </div>
      <a
        v-if="!extended"
        class="text-green-600 text-sm underline hover:text-green-700 cursor-pointer"
        @click="extended = !extended"
      >
        Weitere Details und Einstellungen
      </a>
      <div class="grid grid-cols-2 gap-5 mt-5">
        <Button
          color="secondary"
          class="justify-center"
        >
          Ablehnen
        </Button>
        <Button
          color="green"
          class="justify-center"
        >
          Alle erlauben
        </Button>
      </div>
    </div>
  </div>
</template>
