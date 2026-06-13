import { makeApp } from '../../util/make-app.js'
import { authorize } from './middleware/authorize.js'
import { veranstaltungPhotoArchive } from './photos.archive.js'
import { veranstaltungRechnungsimport } from './rechnungsimport.csv.js'
import { veranstaltungTeilnehmendenliste } from './teilnehmendenliste.sheet.js'
import { veranstaltungUnterschriftenliste } from './unterschriftenliste.sheet.js'
import { veranstaltungVerpflegung } from './verpflegung.sheet.js'

const exportRouter = makeApp()
  .use(authorize)
  .get('/sheet/teilnehmendenliste', veranstaltungTeilnehmendenliste)
  .get('/sheet/unterschriftenliste', veranstaltungUnterschriftenliste)
  .get('/sheet/verpflegung', veranstaltungVerpflegung)
  .get('/archive/photos', veranstaltungPhotoArchive)
  .get('/csv/rechnungsimport', veranstaltungRechnungsimport)

export { exportRouter }
