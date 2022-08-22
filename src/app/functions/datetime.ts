import { DateTime, Interval } from 'luxon'

export const formatDatetime = (iso: string, fuzzy = false): string => {
  const date = DateTime.fromISO(iso)
  const now = DateTime.now()
  const interval = Interval.fromDateTimes(date, now)
  let format = ''

  if (fuzzy) {
    if (interval.length('years') > 1) {
      format = 'dd/MM/yyyy'
    } else if (interval.length('weeks') > 1) {
      format = 'd MMM'
    } else if (interval.length('days') > 1) {
      format = 'ccc'
    } else {
      format = 'HH:mm'
    }
  } else {
    if (interval.length('days') > 1) {
      format = 'cccc'
    }
    if (interval.length('weeks') > 1) {
      format += ', d MMM'
    }
    if (interval.length('years') > 1) {
      format += ' yyyy'
    }
    if (format) {
      format += ' • '
    }
    format += 'HH:mm'
  }

  return date.toFormat(format)
}
