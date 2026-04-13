import { useState, Fragment } from 'react'
import { isAaronFree, getStartOfWeek, getWeekDates } from './schedule'
import './App.css'

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_INIT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function toInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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
      className={`today-banner ${free ? 'status-free' : 'status-working'}`}
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

// ── Date Picker ──────────────────────────────────────────────────────────────

function DatePicker({
  selectedDate,
  onChange,
}: {
  selectedDate: Date
  onChange: (d: Date) => void
}) {
  const free = isAaronFree(selectedDate)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      // Append T00:00:00 to force local-time parsing (bare ISO dates parse as UTC)
      onChange(new Date(e.target.value + 'T00:00:00'))
    }
  }

  return (
    <section className="picker-section">
      <h2 className="section-label">Check any date</h2>
      <input
        type="date"
        className="date-input"
        value={toInputValue(selectedDate)}
        onChange={handleChange}
        min="2020-01-01"
        max="2035-12-31"
        aria-label="Select a date to check Aaron's schedule"
      />
      <div className={`picker-result ${free ? 'status-free' : 'status-working'}`}>
        <span className="picker-date-text">{formatFullDate(selectedDate)}</span>
        <span className="picker-verdict">{free ? 'Free' : 'Working'}</span>
      </div>
    </section>
  )
}

// ── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const todayFree = isAaronFree(today)

  return (
    <main className="app">
      <header className="app-header">
        <span className="app-title">Is Aaron Free?</span>
      </header>

      <TodayBanner free={todayFree} date={today} />

      <WeekList today={today} />

      <div className="picker-dock">
        <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
      </div>
    </main>
  )
}
