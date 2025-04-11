import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const state = reactive({
  name: route?.meta?.title || '',
})

export function useRouteTitle() {
  const setTitle = (newTitle) => {
    state.name = newTitle
  }

  return {
    title: state,
    setTitle,
  }
}
