import { useRouteQuery } from '@vueuse/router'
import { computed } from 'vue'
import { type MaybeRef, type Ref, unref } from 'vue'

import { type TGridColumn } from '@codeanker/datagrid'

export function useDataGridOrderBy<
  TDefaultOrderBy extends [string, 'asc' | 'desc' | undefined][],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TColumns extends TGridColumn<any, any>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
>(columns: MaybeRef<TColumns>, defaultOrderBy: TDefaultOrderBy, router?: any, route?: any) {
  const sortableKeys = computed(() =>
    unref(columns)
      .filter((column) => column?.sortable)
      .map((col) => col.field)
  )

  const routeQueryOrderByList = computed(() => {
    return sortableKeys.value.map((key) => {
      const defaultValue = defaultOrderBy.find(([k]) => k === key)?.[1] ?? undefined
      return [
        key,
        useRouteQuery(`orderBy_${key}`, defaultValue, {
          router,
          route,
        }),
      ] as [keyof TDefaultOrderBy | string, Ref<'asc' | 'desc' | '' | undefined>]
    })
  })

  // const orderBy = ref<[string, 'asc' | 'desc' | undefined][]>([['id', 'asc']])
  const orderBy = computed<[keyof TDefaultOrderBy | string, 'asc' | 'desc' | undefined][]>({
    get() {
      return (
        routeQueryOrderByList.value
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([key, value]) => {
            if (value.value === undefined) return false
            if (value.value === '') return false
            return true
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map(([key, value]) => [key, value.value]) as any as [
          keyof TDefaultOrderBy | string,
          'asc' | 'desc' | undefined,
        ][]
      )
    },
    set(val) {
      for (const item of val) {
        setOrderBy({ field: item[0] as string, value: item[1] })
      }
      // for (const obj of val) {
      //   const field = Object.keys(obj)[0]
      //   const value = obj[field]
      //   setOrderBy({ field, value: value })
      // }
    },
  })

  async function setOrderBy({ field, value }: { field: string; value: 'asc' | 'desc' | '' | undefined }) {
    const orderBy = routeQueryOrderByList.value.find(([k]) => k === field)
    if (!orderBy) throw new Error('orderBy not found. Probably not sortable')
    // Wenn der default nicht undefined ist, dann wird ein leerer string als "keine sortierung"
    // benutzt, da sonst useRouteQuery den default (eine sortierung) benutzen würde
    const defaultValue = defaultOrderBy.find(([k]) => k === field)?.[1] ?? undefined
    if (value === undefined && defaultValue !== undefined) {
      await router.replace({ query: { ...route.query, [`orderBy_${field}`]: '' } })
    } else {
      if (value === defaultValue) await router.replace({ query: { ...route.query, [`orderBy_${field}`]: undefined } })
      else await router.replace({ query: { ...route.query, [`orderBy_${field}`]: value } })
    }
  }

  async function reset() {
    for (const [key] of routeQueryOrderByList.value) {
      await router.replace({ query: { ...route.query, [`orderBy_${key as string}`]: undefined } })
    }
  }

  return {
    orderBy,
    setOrderBy,
    reset,
  }
}
