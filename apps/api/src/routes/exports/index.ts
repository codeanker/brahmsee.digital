import { makeApp } from '../../util/make-app.js'
import { veranstaltungPhotoArchive } from './photos.archive.js'
import { veranstaltungTeilnehmendenliste } from './teilnehmendenliste.sheet.js'
import { veranstaltungVerpflegung } from './verpflegung.sheet.js'

const exportRouter = makeApp()

exportRouter.get('/sheet/teilnehmendenliste', veranstaltungTeilnehmendenliste)
exportRouter.get('/sheet/verpflegung', veranstaltungVerpflegung)
exportRouter.get('/archive/photos', veranstaltungPhotoArchive)

export { exportRouter }
