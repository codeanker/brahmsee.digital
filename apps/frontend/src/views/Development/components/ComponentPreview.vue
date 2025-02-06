<script setup lang="ts">
import { CheckIcon, ClipboardIcon, CodeBracketIcon, EyeIcon } from '@heroicons/vue/24/outline'
import { useClipboard } from '@vueuse/core'
import SshPre from 'simple-syntax-highlighter'
import { ref } from 'vue'
import 'simple-syntax-highlighter/dist/sshpre.css'

const props = defineProps<{
  name: string
  description: string
  date?: string
  code: string
  jsCode?: string
}>()

const { copy, isSupported, copied } = useClipboard()

const copyCode = () => {
  if (isSupported.value && props.code) {
    copy(props.code)
  }
}

const showCode = ref(false)
</script>

<template>
  <div class="relative">
    <div class="grid lg:grid-cols-3 gap-6 grid-cols-1">
      <div class="mt-8 lg:mt-8 space-y-2">
        <div class="flex justify-between items-center">
          <h5 class="mb-0">
            {{ name }}
          </h5>
        </div>
        <p>
          {{ description }}
        </p>
      </div>
      <div class="col-span-2">
        <div class="flex justify-end mb-2 items-center">
          <div class="bg-gray-100 dark:bg-gray-900 rounded-lg flex">
            <div
              class="py-0.5 px-2 items-center flex cursor-pointer border-gray-100 dark:border-gray-700 border rounded-lg"
              :class="{ 'bg-white dark:bg-dark-primary': !showCode }"
              @click="showCode = false"
            >
              <EyeIcon class="w-6 h-6" />
            </div>
            <div
              class="py-0.5 px-2 items-center flex cursor-pointer border-gray-100 dark:border-gray-700 border rounded-lg"
              :class="{ 'bg-white dark:bg-dark-primary': showCode }"
              @click="showCode = true"
            >
              <CodeBracketIcon class="w-6 h-6" />
            </div>
          </div>
          <div
            class="cursor-pointer px-2"
            @click="copyCode"
          >
            <ClipboardIcon
              v-if="!copied"
              class="w-6 h-6"
            />
            <CheckIcon
              v-else
              class="w-6 h-6"
            />
          </div>
        </div>

        <div
          v-if="!showCode"
          class="relative"
        >
          <div class="rounded-xl relative">
            <div class="absolute inset-0 rounded-xl overflow-hidden border dark:border-gray-700">
              <!-- <img
                :src="lines"
                class="bg-white z-10 object-cover object-center w-full h-full"
              /> -->
            </div>
            <div class="relative p-4 flex justify-center">
              <slot />
            </div>
          </div>
        </div>
        <div v-else>
          <SshPre
            language="html-vue"
            dark
            class="rounded-2xl mt-0 p-4 text-sm select-text"
          >
            {{ code }}
          </SshPre>
          <SshPre
            v-if="jsCode"
            language="js"
            dark
            class="rounded-2xl p-4 text-sm select-text"
          >
            {{ jsCode }}
          </SshPre>
        </div>
        <div
          v-if="date"
          class="flex justify-end mt-2 items-center text-sm text-slate-600"
        >
          Erstellt am: {{ date }}
        </div>
      </div>
    </div>
  </div>
</template>
