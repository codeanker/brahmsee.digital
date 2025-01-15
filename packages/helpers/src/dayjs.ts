import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjsDuration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/de'

dayjs.locale('de')

export { dayjs, dayjsDuration, relativeTime, customParseFormat }
