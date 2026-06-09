import { Fragment } from 'react'
import { isAaronFree, getStartOfWeek, getWeekDates } from './schedule'
import './App.css'

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_INIT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// ── Today Banner ────────────────────────────────────────────────────────────

function TodayBanner({ free, date }: { free: boolean; date: Date }) {
  return (
    <section
      className={`today-banner ${free ? 'banner-free' : 'banner-working'}`}
      role="status"
      aria-live="polite"
    >
      <p className="today-eyebrow">Today · {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      <p className="today-verdict">{free ? 'Free' : 'Working'}</p>
      <p className="today-subtext">
        {free ? 'Aaron is available today' : 'Aaron is at work today'}
      </p>
    </section>
  )
}

// ── Week Grid (single row, no label) ────────────────────────────────────────

function WeekGrid({ weekStart, today }: { weekStart: Date; today: Date }) {
  const days = getWeekDates(weekStart)

  return (
    <div className="week-grid" role="list">
      {days.map((day, i) => {
        const free = isAaronFree(day)
        const isToday = isSameDay(day, today)
        return (
          <div
            key={i}
            role="listitem"
            className={[
              'day-cell',
              free ? 'day-free' : 'day-working',
              isToday ? 'day-today' : '',
            ].join(' ')}
            aria-label={`${DAY_ABBR[day.getDay()]} ${day.getDate()}: ${free ? 'Free' : 'Working'}${isToday ? ' (today)' : ''}`}
          >
            <span className="day-abbr" aria-hidden="true">{DAY_ABBR[day.getDay()]}</span>
            <span className="day-init" aria-hidden="true">{DAY_INIT[day.getDay()]}</span>
            <span className="day-num">{day.getDate()}</span>
            <span className="day-dot" aria-hidden="true" />
          </div>
        )
      })}
    </div>
  )
}

// ── Week List (52 weeks with sticky month headers) ───────────────────────────

function WeekList({ today }: { today: Date }) {
  const firstWeekStart = getStartOfWeek(today)

  const weeks: Date[] = Array.from({ length: 52 }, (_, i) =>
    new Date(
      firstWeekStart.getFullYear(),
      firstWeekStart.getMonth(),
      firstWeekStart.getDate() + i * 7
    )
  )

  return (
    <div className="weeks-list">
      {weeks.map((weekStart, i) => {
        const isNewMonth =
          i === 0 || weekStart.getMonth() !== weeks[i - 1].getMonth()

        return (
          <Fragment key={i}>
            {isNewMonth && (
              <div className={`month-header ${i === 0 ? 'month-header--first' : ''}`}>
                {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            )}
            <WeekGrid weekStart={weekStart} today={today} />
          </Fragment>
        )
      })}
    </div>
  )
}

// ── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const today = new Date()
  const todayFree = isAaronFree(today)

  return (
    <main className="app">
      <header className="app-header">
        <span className="app-title">Is Aaron Free?</span>
      </header>

      <TodayBanner free={todayFree} date={today} />

      <WeekList today={today} />
    </main>
  )
}
