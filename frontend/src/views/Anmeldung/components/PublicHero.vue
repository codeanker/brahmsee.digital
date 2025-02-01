<script lang="ts" setup>
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { dayjs } from '@codeanker/helpers'

const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div class="relative isolate">
    <svg
      class="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
          width="200"
          height="200"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M.5 200V.5H200"
            fill="none"
          />
        </pattern>
      </defs>
      <svg
        x="50%"
        y="-1"
        class="overflow-visible fill-gray-50"
      >
        <path
          d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
          stroke-width="0"
        />
      </svg>
      <rect
        width="100%"
        height="100%"
        stroke-width="0"
        fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
      />
    </svg>
    <div
      class="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
      aria-hidden="true"
    >
      <div
        class="aspect-[801/801] w-[50.0625rem] bg-gradient-to-tr from-[#16a34a] to-[#0e5126] opacity-30"
        style="
          clip-path: polygon(
            63.1% 29.5%,
            100% 17.1%,
            76.6% 3%,
            48.4% 0%,
            44.6% 4.7%,
            54.5% 25.3%,
            59.8% 49%,
            55.2% 57.8%,
            44.4% 57.2%,
            27.8% 47.9%,
            35.1% 81.5%,
            0% 97.7%,
            39.2% 100%,
            35.2% 81.4%,
            97.2% 52.8%,
            63.1% 29.5%
          );
        "
      />
    </div>
    <div class="overflow-hidden">
      <div class="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
        <div class="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
          <div class="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
            <div class="inline-flex space-x-6">
              <span
                v-if="unterveranstaltung?.veranstaltung?.beginn"
                class="rounded-full bg-primary-600/10 px-3 py-1 text-sm/6 font-semibold text-primary-600 ring-1 ring-primary-600/10 ring-inset"
                >{{ dayjs(unterveranstaltung?.veranstaltung.beginn).format('DD.MM') }}
                <span v-if="unterveranstaltung?.veranstaltung?.ende"
                  >- {{ dayjs(unterveranstaltung?.veranstaltung?.ende).format('DD.MM.YY') }}</span
                ></span
              >
              <span
                v-if="unterveranstaltung?.meldeschluss"
                class="inline-flex items-center space-x-2 text-sm/6 text-gray-600"
              >
                <span>Meldeschluss am {{ dayjs(unterveranstaltung?.meldeschluss).format('DD.MM.YY') }}</span>
              </span>
            </div>
            <h1 class="mt-10 text-pretty text-5xl tracking-tight text-gray-900 sm:text-7xl">
              {Marketing | Titel} Landeskindertreffen im Waldheim am Brahmsee 2025
            </h1>
            <p class="mt-8 text-pretty text-lg font-medium text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
              {Marketing | Untertitel} Es ist das Event des Jahres! Sei dabei und erlebe eine unvergessliche Zeit mit
              deinen Freunden. Melde dich jetzt an und sichere dir deinen Platz. Wir freuen uns auf dich!
            </p>
            <div class="mt-10 flex items-center gap-x-6">
              <RouterLink
                class="cursor-pointer text-gray-900 hover:underline"
                :to="{ name: 'Login', query: { redirect: '/ausschreibung/' + unterveranstaltung?.id } }"
              >
                Anmelden <span aria-hidden="true">&rarr;</span>
              </RouterLink>
              <a
                href="#"
                class="rounded-md bg-primary-600 px-3.5 py-2.5 text font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Jetzt anmelden</a
              >
            </div>
          </div>
          <div class="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto">
            <div class="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8">
              <div class="aspect-square overflow-hidden rounded-xl shadow-xl">
                <img
                  alt=""
                  src="https://jugendherberge-brahmsee.de/wp-content/uploads/2024/03/Jugendherberge-Brahmsee-Angebote-Keyvisual.jpg"
                  class="block size-full object-cover"
                />
              </div>
              <div class="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl lg:-mt-40">
                <img
                  alt=""
                  src="https://jugendherberge-brahmsee.de/wp-content/uploads/2024/04/jh_angebote_tagung_slider_05.jpg"
                  class="block size-full object-cover"
                />
              </div>
              <div class="aspect-square overflow-hidden rounded-xl shadow-xl">
                <img
                  alt=""
                  src="https://jugendherberge-brahmsee.de/wp-content/uploads/2024/04/jh_angebote_wochenende_slider_01.jpg"
                  class="block size-full object-cover"
                />
              </div>
              <div class="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl lg:-mt-40">
                <img
                  alt=""
                  src="https://jugendherberge-brahmsee.de/wp-content/uploads/2024/04/jh_angebote_wochenende_slider_04.jpg"
                  class="block size-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
