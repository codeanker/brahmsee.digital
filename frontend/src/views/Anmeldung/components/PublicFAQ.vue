<script lang="ts" setup>
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div
    v-if="unterveranstaltung?.landingSettings.faqVisible && unterveranstaltung?.faqs"
    class="bg-white"
  >
    <div class="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Häufig gestellte Fragen</h2>
        <p class="mt-4 text-pretty text-base/7 text-gray-600">
          Du kannst eine Frage nicht finden? Dann
          <a
            href="#"
            class="font-semibold text-primary-600 hover:text-primary-500"
            >schreib uns einfach</a
          >
          eine E-Mail
        </p>
        <template
          v-for="(faqs, category) in unterveranstaltung?.faqs"
          :key="category"
        >
          <div class="mt-16 mb-8 text-base text-gray-600 font-semibold">{{ category }}</div>
          <dl class="divide-y divide-gray-900/10">
            <Disclosure
              v-for="faq in faqs"
              :key="faq.question"
              v-slot="{ open }"
              as="div"
              class="py-6 first:pt-0 last:pb-0"
            >
              <dt>
                <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                  <span class="text-base/7 font-semibold">{{ faq.question }}</span>
                  <span class="ml-6 flex h-7 items-center">
                    <PlusIcon
                      v-if="!open"
                      class="size-6"
                      aria-hidden="true"
                    />
                    <MinusIcon
                      v-else
                      class="size-6"
                      aria-hidden="true"
                    />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel
                as="dd"
                class="mt-2 pr-12"
              >
                <p class="text-base/7 text-gray-600">{{ faq.answer }}</p>
              </DisclosurePanel>
            </Disclosure>
          </dl>
        </template>
      </div>
    </div>
  </div>
</template>
