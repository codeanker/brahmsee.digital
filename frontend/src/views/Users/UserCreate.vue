<script setup lang="ts">
import { UserIcon } from '@heroicons/vue/24/outline'

import FormUserGeneral from '@/components/forms/user/FormUserGeneral.vue'
import BasicHeader from '@/components/LayoutComponents/BasicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <BasicHeader title="Neuen Benutzer erstellen">
      <template #icon>
        <UserIcon class="h-8 w-8" />
      </template>
      <template #content>
        <Button
          :to="{ name: 'Users' }"
          color="danger"
        >
          Abbrechen
        </Button>
      </template>
    </BasicHeader>

    <FormUserGeneral mode="create" />
  </div>
</template>
