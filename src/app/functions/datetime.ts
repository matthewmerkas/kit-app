import { DateTime, Interval } from 'luxon'

export const formatDatetime = (iso: string, fuzzy = false): string => {
  const date = DateTime.fromISO(iso)
  if (fuzzy) {
    const now = DateTime.now()
    const days = Interval.fromDateTimes(date, now).length('days')
    if (days > 1) {
      return date.toFormat('D')
    }
  }
  return date.toFormat('HH:mm')
}
