import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjsDuration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/de'

dayjs.locale('de')

export { dayjs, dayjsDuration, relativeTime, customParseFormat }
