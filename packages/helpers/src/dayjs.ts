import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

import 'dayjs/locale/de'

dayjs.extend(customParseFormat)

dayjs.locale('de')

export { dayjs }
