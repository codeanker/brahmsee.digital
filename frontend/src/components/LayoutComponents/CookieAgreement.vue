<script setup lang="ts">
import Button from '../UIComponents/Button.vue'
</script>

<template>
  <div class="fixed z-50 w-screen h-screen bg-black/40 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-6 w-[600px]">
      <div class="flex justify-between mb-5">
        <div class="flex flex-col">
          <div class="text-xl font-medium">Moin Moin,</div>
          <div class="text-sm font-medium">Diese Website verwendet Cookies</div>
        </div>
        <img
          class="h-12"
          src="@/assets/images/cookies.webp"
        />
      </div>
      <div class="mb-5">
        Wir verwenden Cookies, um den Datenverkehr auf unserer Website zu analysieren und ihre Bedienung zu verbessern.
        Außerdem teilen wir Informationen über Ihre Nutzung unserer Website mit unseren Partnern für Analysen, die diese
        Informationen mit anderen Daten kombinieren können, die Sie bereitgestellt haben oder die sie aus Ihrer Nutzung
        ihrer Dienste erhalten haben.
      </div>
      <a class="text-green-600 text-sm underline hover:text-green-700 cursor-pointer">
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
          color="primary"
          class="justify-center"
        >
          Alle erlauben
        </Button>
      </div>
    </div>
  </div>
</template>
