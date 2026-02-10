import { makeApp } from '../../util/make-app.js'
import { authorize } from './middleware/authorize.js'
import { veranstaltungPhotoArchive } from './photos.archive.js'
import { veranstaltungTeilnehmendenliste } from './teilnehmendenliste.sheet.js'
import { veranstaltungTShirtListe } from './tshirt-liste.pdf.js'
import { veranstaltungVerpflegung } from './verpflegung.sheet.js'

const exportRouter = makeApp()
  .use(authorize)
  .get('/sheet/teilnehmendenliste', veranstaltungTeilnehmendenliste)
  .get('/sheet/verpflegung', veranstaltungVerpflegung)
  .get('/pdf/tshirt-liste', veranstaltungTShirtListe)
  .get('/archive/photos', veranstaltungPhotoArchive)

export { exportRouter }
