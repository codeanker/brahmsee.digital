/**
 * Pre-configured dayjs instance with German locale and Europe/Berlin timezone.
 * 
 * This module extends dayjs with:
 * - Custom parse format support
 * - UTC and timezone support
 * - German locale (de)
 * - Default timezone set to Europe/Berlin
 * 
 * @module dayjs
 * @see {@link https://day.js.org/docs/en/installation/installation|Day.js Documentation}
 */

import dayjs, { type Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import 'dayjs/locale/de'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('de')

dayjs.tz.setDefault('Europe/Berlin')

export { dayjs, type Dayjs }
