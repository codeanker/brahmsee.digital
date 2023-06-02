import { createGlobalState, useStorage } from '@vueuse/core'
import { dayjs } from '@codeanker/helpers'

interface DashboardState {
  passangers: number
  radius: number
  date: Date
  origin?: {
    latLng: [number, number]
    formattedAddress: string
  }
  destination?: {
    latLng: [number, number]
    formattedAddress: string
  }
}

export const useDashboardState = createGlobalState(() => {
  const defaultDashboardState: DashboardState = {
    passangers: 1 as number,
    radius: 10 as number,
    date: dayjs().toDate() as Date,
    origin: undefined,
    destination: undefined,
  }

  const dashboard = useStorage('dasboard-storage', defaultDashboardState)

  function resetState() {
    dashboard.value = defaultDashboardState
  }

  return {
    resetState,
    dashboard,
  }
})
