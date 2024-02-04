import type Router from 'koa-router'

import { veranstaltungTeilnehmendenliste } from './sheets/teilnehmendenliste'
import { veranstaltungVerpflegung } from './sheets/verpflegung'

export default function addExports(router: Router) {
  router.get('/export/sheet/teilnehmendenliste', veranstaltungTeilnehmendenliste)
  router.get('/export/sheet/verpflegung', veranstaltungVerpflegung)
}
