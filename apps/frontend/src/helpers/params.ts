import { useRoute } from 'vue-router'

export function paramInt(name: string) {
  const route = useRoute()
  const id = route.params[name]
  if (Array.isArray(id)) {
    return NaN
  }

  return parseInt(id)
}
