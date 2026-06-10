// January 10, 2026 is a Saturday known to be a Free day.
// Saturday=Free appears only in Week B, so weekType = 'B'.
const ANCHOR_DATE = new Date(2026, 0, 10);
const ANCHOR_WEEK_TYPE: 'A' | 'B' = 'B';

// Index 0=Sun, 1=Mon, ..., 6=Sat. false=Free, true=Working.
const WEEK_A: readonly boolean[] = [false, true, true, false, false, true, true];
const WEEK_B: readonly boolean[] = [true, false, false, true, true, false, false];

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_INIT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export interface DayData {
  isoDate: string;
  dayNum: number;
  dayAbbr: string;
  dayInit: string;
  free: boolean;
  isToday: boolean;
  ariaLabel: string;
}

export interface WeekData {
  isNewMonth: boolean;
  isFirstMonth: boolean;
  monthLabel: string | null;
  days: DayData[];
}

export interface ScheduleDay {
  date: string;
  dayOfWeek: string;
  status: 'free' | 'working';
}

function normalizeMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  const d = normalizeMidnight(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function isAaronFree(date: Date): boolean {
  const qSunday = startOfWeek(date);
  const aSunday = startOfWeek(ANCHOR_DATE);
  const daysDiff = Math.round((qSunday.getTime() - aSunday.getTime()) / 86_400_000);
  const weeksDiff = daysDiff / 7;
  const sameType = weeksDiff % 2 === 0;
  const weekTable = sameType
    ? (ANCHOR_WEEK_TYPE === 'A' ? WEEK_A : WEEK_B)
    : (ANCHOR_WEEK_TYPE === 'A' ? WEEK_B : WEEK_A);
  return !weekTable[normalizeMidnight(date).getDay()];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildWeekList(today: Date): WeekData[] {
  const firstWeekStart = startOfWeek(today);
  const weeks: WeekData[] = [];
  let prevMonth: number | null = null;
  let isFirstMonth = true;

  for (let i = 0; i < 52; i++) {
    const weekStart = new Date(
      firstWeekStart.getFullYear(),
      firstWeekStart.getMonth(),
      firstWeekStart.getDate() + i * 7
    );

    const month = weekStart.getMonth();
    const isNewMonth = month !== prevMonth;

    const days: DayData[] = Array.from({ length: 7 }, (_, j) => {
      const day = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + j);
      const free = isAaronFree(day);
      const todayFlag = isSameDay(day, today);
      const dow = day.getDay();
      return {
        isoDate: toISODate(day),
        dayNum: day.getDate(),
        dayAbbr: DAY_ABBR[dow],
        dayInit: DAY_INIT[dow],
        free,
        isToday: todayFlag,
        ariaLabel: `${DAY_ABBR[dow]} ${day.getDate()}: ${free ? 'Free' : 'Working'}${todayFlag ? ' (today)' : ''}`,
      };
    });

    weeks.push({
      isNewMonth,
      isFirstMonth: isNewMonth && isFirstMonth,
      monthLabel: isNewMonth
        ? weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null,
      days,
    });

    if (isNewMonth) {
      prevMonth = month;
      isFirstMonth = false;
    }
  }

  return weeks;
}

export function buildScheduleJson(today: Date): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  for (let i = 0; i < 14; i++) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    days.push({
      date: toISODate(day),
      dayOfWeek: DAY_ABBR[day.getDay()],
      status: isAaronFree(day) ? 'free' : 'working',
    });
  }
  return days;
}
