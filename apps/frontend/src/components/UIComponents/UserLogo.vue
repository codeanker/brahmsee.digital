<script setup lang="ts">
import { apiClient } from '@/api'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref, watch, withDefaults } from 'vue'
import AvatarEditModal from './AvatarEditModal.vue'
import Loading from './Loading.vue'

const props = withDefaults(
  defineProps<{
    personId?: number
    photoId?: string | null
    name?: any
    firstname?: string
    lastname?: string
    statusLed?: boolean
    border?: boolean
    size?: 'sm' | 'xl'
    loading?: boolean
    edit?: boolean
    cssClasses?: string
  }>(),
  {
    statusLed: false,
    border: false,
    size: 'sm',
    loading: false,
    cssClasses: 'h-full w-full',
  }
)

const emit = defineEmits<{
  triggerRefresh: []
}>()

const photoId = ref(props.photoId)

const getName = computed(() => {
  let name
  if (props.name) {
    name = props.name
  } else if (props.firstname && props.lastname) {
    name = props.firstname + ' ' + props.lastname
  }
  const nameParts = name.split(' ').filter((namePart) => namePart !== '')
  if (nameParts.length > 1) {
    const lastElement = nameParts.length - 1
    return `${nameParts[0][0].toUpperCase()}${nameParts[lastElement][0].toUpperCase()}`
  } else {
    return `${nameParts[0][0].toUpperCase()}${nameParts[0][1].toUpperCase()}`
  }
})

const {
  isLoading: loading,
  state: photoUrl,
  execute: loadPhotoUrl,
} = useAsyncState(
  async () => {
    if (photoId.value) {
      return await apiClient.file.fileGetUrl.query({
        id: photoId.value,
        personId: props.personId,
      })
    }
  },
  null,
  {
    immediate: true,
  }
)

const updated = (id?: string) => {
  if (id) photoId.value = id
  loadPhotoUrl()
  emit('triggerRefresh')
}

watch(
  () => props.photoId,
  () => {
    loadPhotoUrl()
  }
)

const refAvatarEditModal = ref<InstanceType<typeof AvatarEditModal>>()

const openAvatarEditModal = () => {
  refAvatarEditModal.value?.open()
}
</script>

<template>
  <div
    v-if="!loading"
    :class="[{ border: border }, { 'border-primary-600': border }, cssClasses]"
    class="relative"
  >
    <div
      class="z-10 flex h-full w-full items-center justify-center rounded-full bg-primary-200 font-bold text-primary-600 overflow-hidden"
      :class="[{ 'text-4xl': size === 'xl' }, { 'text-sm': size === 'sm' }]"
    >
      <img
        v-if="photoUrl"
        :src="photoUrl"
        class="object-cover w-full h-full"
      />
      <div v-else>{{ getName }}</div>
      <button
        v-if="edit"
        class="absolute bottom-0 right-0 h-full w-full rounded-full bg-primary-200 text-white opacity-0 transition-all duration-200 ease-in-out hover:opacity-100"
        type="button"
        @click="openAvatarEditModal"
      >
        <PencilSquareIcon class="mx-auto h-10 text-primary-600" />
      </button>
    </div>
    <div
      v-if="statusLed"
      class="bg-success absolute z-20 h-1/4 w-1/4 rounded-full"
    />
  </div>
  <div v-else>
    <div
      :class="[{ border: border }, { 'border-primary-600': border }]"
      class="relative h-full w-full"
    >
      <div
        class="z-10 flex items-center justify-center rounded-full bg-primary-200 p-3 font-bold text-primary-600"
        :class="[{ 'text-4xl': size === 'xl' }, { 'text-sm': size === 'sm' }]"
      >
        <Loading size="sm" />
      </div>
      <div
        v-if="statusLed"
        class="bg-success absolute z-20 h-1/4 w-1/4 rounded-full"
      />
    </div>
  </div>
  <AvatarEditModal
    v-if="props.personId"
    ref="refAvatarEditModal"
    :person-id="props.personId"
    :show-remove="!!photoUrl"
    @trigger-refresh="updated"
    @uploaded="(id) => updated(id)"
  />
</template>
