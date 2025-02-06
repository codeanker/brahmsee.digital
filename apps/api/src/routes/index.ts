import Router from 'koa-router'
import addMiddlewares from '../middleware/index.js'

import connect from './connect.js'
import { veranstaltungTeilnehmendenliste } from './exports/sheets/teilnehmendenliste.js'
import { veranstaltungVerpflegung } from './exports/sheets/verpflegung.js'

const koaRouter = new Router()

koaRouter.get('/connect/dlrg/callback', connect)

koaRouter.get('/export/sheet/teilnehmendenliste', veranstaltungTeilnehmendenliste)
koaRouter.get('/export/sheet/verpflegung', veranstaltungVerpflegung)

addMiddlewares(koaRouter)

export default koaRouter
