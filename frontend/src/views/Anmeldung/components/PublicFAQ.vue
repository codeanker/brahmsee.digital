<script lang="ts" setup>
const faqs = [
  {
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
]
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
          <dl class="space-y-10">
            <div
              v-for="faq in faqs"
              :key="faq.question"
            >
              <dt class="text-base/7 font-semibold text-gray-900">{{ faq.question }}</dt>
              <dd class="mt-2 text-base/7 text-gray-600">{{ faq.answer }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
