<script setup>
import { CheckIcon } from '@heroicons/vue/24/solid'

const features = [
  {
    name: '{Marketing | Section Key} Abenteuer erleben',
    description:
      '{Marketing | Section Description} Das Zeltlager bietet spannende Outdoor-Aktivitäten, bei denen du neue Abenteuer erleben kannst.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Neue Freundschaften schließen',
    description:
      'Triff gleichgesinnte Kinder und Jugendliche und knüpfe neue Freundschaften, die ein Leben lang halten können.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Natur genießen',
    description:
      'Erlebe das wunderschöne Naturpanorama rund um den Brahmsee und genieße unvergessliche Tage in freier Natur.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Teamarbeit stärken',
    description: 'Lerne wertvolle Fähigkeiten im Team und baue deine Teamarbeit durch diverse Gruppenaktivitäten aus.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Lebensretterausbildung',
    description: 'Nimm an Kursen teil, die dir zeigen, wie du in Notsituationen helfen und Leben retten kannst.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Spaß im Wasser',
    description: 'Erlebe Wasserspaß mit Schwimmen, Spielen und Wassersportarten unter professioneller Aufsicht.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Kreative Workshops',
    description: 'Nimm an kreativen Workshops teil und entdecke neue Hobbys und Interessen.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Selbstständigkeit fördern',
    description:
      'Fördere deine Selbstständigkeit und Eigenverantwortung durch die Teilnahme an einem strukturierten Camp.',
    href: '#',
    icon: CheckIcon,
  },
  {
    name: 'Erinnerungen sammeln',
    description: 'Schaffe bleibende Erinnerungen an eine besondere Zeit voller Freude und gemeinschaftlichem Erleben.',
    href: '#',
    icon: CheckIcon,
  },
]
</script>

<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:text-center">
        <p class="mt-2 text-4xl font-semibold text-pretty text-gray-900 sm:text-5xl lg:text-balance">
          {Marketing | Section Title} Es gibt viele Gründe, weshalb du teilnehmen solltest.
        </p>
        <p class="mt-6 text-lg/8 text-gray-600">
          {Marketing | Section Untertitel} Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse
          eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc.
        </p>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.name"
            class="flex flex-col"
          >
            <dt class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900">
              <component
                :is="feature.icon"
                class="size-5 flex-none text-primary-600"
                aria-hidden="true"
              />
              {{ feature.name }}
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600">
              <p class="flex-auto">{{ feature.description }}</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
