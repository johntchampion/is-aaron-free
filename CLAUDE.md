# Is Aaron Free? — Express SSR

Server-side rendered Express + EJS app that shows whether Aaron is free or working on any given day.

## Aaron's work schedule

Aaron's schedule alternates between two week types (A and B) indefinitely:

| Week | Sun | Mon | Tue | Wed | Thu | Fri | Sat |
|------|-----|-----|-----|-----|-----|-----|-----|
| A    | Free | Working | Working | Free | Free | Working | Working |
| B    | Working | Free | Free | Working | Working | Free | Free |

The anchor for the math is **January 10, 2026 (Saturday) = Free**, which places it in Week B. All other dates are derived by counting weeks from that anchor and alternating week types.

## Architecture

All schedule computation happens server-side in `schedule.ts` before the template is rendered. There is no client-side JavaScript.

- **`schedule.ts`** — pure schedule logic. `isAaronFree(date)` is the core function. `buildWeekList(today)` and `buildScheduleJson(today)` produce view-ready data for the template and JSON endpoint respectively.
- **`server.ts`** — Express app. Two routes: `GET /` renders the EJS template; `GET /schedule.json` returns a 14-day machine-readable feed.
- **`views/index.ejs`** — EJS template. Receives pre-computed view data from the server. No logic beyond simple iteration and conditionals.
- **`public/style.css`** — static styles. Light/dark mode via `prefers-color-scheme` media query only — no JS toggle.

## Running the app

```bash
npm install
npm run dev    # tsx --watch server.ts, port 3000
```

## Key constraints

- **No client-side JavaScript.** Schedule data must be fully computed and rendered server-side.
- **No light/dark toggle.** Dark mode is handled entirely via the `prefers-color-scheme` CSS media query.
- **No date picker.** The page renders a 52-week scrollable schedule; there is no interactive date picker.
- **AI metadata must stay current.** The JSON-LD block, `<meta name="description">`, and the HTML comment summary are all generated dynamically from today's date — do not hardcode them.

## TypeScript

The project uses CommonJS modules (not ESM). `tsconfig.json` targets ES2022 and outputs to `dist/`. Run `npm run build` before `npm start` in production. In development, `tsx` runs `server.ts` directly without a compile step.

## Schedule algorithm

```
anchor = Jan 10 2026 (Week B, Saturday)
weeksDiff = (startOfWeek(queryDate) - startOfWeek(anchor)) / 7
if weeksDiff is even → same week type as anchor (B)
if weeksDiff is odd  → opposite week type (A)
look up queryDate's day-of-week in the resolved week table
```

Dates are always normalized to local midnight before any arithmetic to avoid DST edge cases.
