// January 10, 2026 is a Saturday known to be a Free day.
// Saturday=Free appears only in Week B, so weekType = 'B'.
const ANCHOR = {
  date: new Date(2026, 0, 10),
  weekType: 'B' as 'A' | 'B',
}

// Index 0=Sun, 1=Mon, ..., 6=Sat. false=Free, true=Working.
const WEEK_A = [false, true, true, false, false, true, true]
const WEEK_B = [true, false, false, true, true, false, false]

function normalizeMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function startOfWeek(date: Date): Date {
  const d = normalizeMidnight(date)
  d.setDate(d.getDate() - d.getDay()) // rewind to Sunday
  return d
}

export function isAaronFree(date: Date): boolean {
  const qSunday = startOfWeek(date)
  const aSunday = startOfWeek(ANCHOR.date)

  const daysDiff = Math.round(
    (qSunday.getTime() - aSunday.getTime()) / 86_400_000,
  )
  const weeksDiff = daysDiff / 7

  // Even weeksDiff → same week type as anchor; odd → opposite type.
  const sameType = weeksDiff % 2 === 0
  const weekTable = sameType
    ? ANCHOR.weekType === 'A'
      ? WEEK_A
      : WEEK_B
    : ANCHOR.weekType === 'A'
      ? WEEK_B
      : WEEK_A

  return !weekTable[normalizeMidnight(date).getDay()]
}

export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date)
}

export function getWeekDates(weekSunday: Date): Date[] {
  return Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        weekSunday.getFullYear(),
        weekSunday.getMonth(),
        weekSunday.getDate() + i,
      ),
  )
}
