<script lang="ts" setup>
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'radix-vue'

const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-5">
          <h2 class="text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Häufig gestellte Fragen
          </h2>
          <p class="mt-4 text-pretty text-base/7 text-gray-600">
            Du kannst eine Frage nicht finden? Dann
            <a
              href="#"
              class="font-semibold text-primary-600 hover:text-primary-500"
              >schreib uns einfach</a
            >
            eine E-Mail
          </p>
        </div>
        <div class="mt-10 lg:col-span-7 lg:mt-0">
          <AccordionRoot type="single">
            <template
              v-for="(faqs, category) in unterveranstaltung?.faqs"
              :key="category"
            >
              <AccordionItem
                :value="category.toString()"
                class="focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t-[7px] last:rounded-b-[7px] focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
              >
                <AccordionHeader class="flex">
                  <AccordionTrigger
                    class="text-grass11 shadow-mauve6 hover:bg-mauve2 flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-sm leading-none shadow-[0_1px_0] outline-none group"
                  >
                    <span>{{ category }}</span>
                    <ChevronDownIcon
                      class="size-6 text-green10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                    />
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <dl class="space-y-10">
                    <div
                      v-for="faq in faqs"
                      :key="faq.question"
                    >
                      <dt class="text-base/7 font-semibold text-gray-900">{{ faq.question }}</dt>
                      <dd class="mt-2 text-base/7 text-gray-600">{{ faq.answer }}</dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>
            </template>
          </AccordionRoot>
        </div>
      </div>
    </div>
  </div>
</template>
