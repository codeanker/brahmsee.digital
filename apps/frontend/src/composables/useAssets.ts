import { reactive } from 'vue'
import * as dilly from '@/assets/images/dilly_logo.webp'
import * as dillySm from '@/assets/images/dilly_logo_sm.webp'
import * as nobbi from '@/assets/images/dilly_logo.webp'
import * as nobbiSm from '@/assets/images/dilly_logo_sm.webp'

const state = reactive({
  logo: checkHost(window.location.host).logo,
  logoSmall: checkHost(window.location.host).logoSmall,
  name: checkHost(window.location.host).name,
})

function checkHost(host) {
  switch (host) {
    case 'localhost':
    case 'brahmsee.digital':
      return {
        logo: dilly.default,
        logoSmall: dillySm.default,
        name: 'brahmsee.digital',
      }
    case 'landes.digital':
      return {
        logo: nobbi.default,
        logoSmall: nobbiSm.default,
        name: 'landes.digital',
      }
    default:
      return {
        logo: dilly.default,
        logoSmall: dillySm.default,
        name: 'brahmsee.digital',
      }
  }
}

export function useAssets() {
  return {
    logo: state.logo,
    logoSmall: state.logoSmall,
    appname: state.name,
  }
}
