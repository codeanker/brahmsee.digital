import type Router from 'koa-router'

import { veranstaltungTeilnehmendenliste } from './sheets/teilnehmendenliste.js'
import { veranstaltungVerpflegung } from './sheets/verpflegung.js'

export default function addExports(router: Router) {
  router.get('/export/sheet/teilnehmendenliste', veranstaltungTeilnehmendenliste)
  router.get('/export/sheet/verpflegung', veranstaltungVerpflegung)
}
