import { reactive } from 'vue'
import * as dilly from '@/assets/images/dilly_logo.webp'
import * as nobbi from '@/assets/images/dilly_logo.webp'

const state = reactive({
  logo: checkHost(window.location.host).logo,
  name: checkHost(window.location.host).name,
})

function checkHost(host) {
  switch (host) {
    case 'localhost':
    case 'brahmsee.digital':
      return {
        logo: dilly.default,
        name: 'brahmsee.digital',
      }
    case 'landes.digital':
      return {
        logo: nobbi.default,
        name: 'landes.digital',
      }
    default:
      return {
        logo: dilly.default,
        name: 'brahmsee.digital',
      }
  }
}

export function useAssets() {
  return {
    logo: state.logo,
    appname: state.name,
  }
}
