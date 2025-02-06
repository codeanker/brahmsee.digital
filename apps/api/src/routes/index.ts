import Router from 'koa-router'

import connect from './connect.js'
import { veranstaltungTeilnehmendenliste } from './exports/sheets/teilnehmendenliste.js'
import { veranstaltungVerpflegung } from './exports/sheets/verpflegung.js'
import { downloadFileLocal } from './files/downloadFileLocal.js'
import { importAnmeldungen } from './files/importAnmeldungen.js'
import { uploadFileLocal } from './files/uploadFileLocal.js'

const koaRouter = new Router()

koaRouter.get('/connect/dlrg/callback', connect)

koaRouter.get('/export/sheet/teilnehmendenliste', veranstaltungTeilnehmendenliste)
koaRouter.get('/export/sheet/verpflegung', veranstaltungVerpflegung)

koaRouter.get('/download/file/LOCAL/:id', downloadFileLocal)
koaRouter.post('/upload/file/LOCAL/:id', uploadFileLocal)

koaRouter.post('/upload/anmeldungen', importAnmeldungen)

export default koaRouter
