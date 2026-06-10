# Is Aaron Free? — Express SSR

Server-side rendered version of the "Is Aaron Free?" schedule checker. Built with Express and EJS. No client-side JavaScript required — all schedule data is computed and rendered on the server.

## Stack

- **Express** — HTTP server
- **EJS** — server-side HTML templating
- **TypeScript** — compiled to CommonJS via `tsc`
- **tsx** — TypeScript runner for development

## Getting started

```bash
npm install
npm run dev      # starts with tsx --watch on port 3000
```

For production:

```bash
npm run build    # compiles TypeScript to dist/
npm start        # runs dist/server.js
```

The server defaults to port `3000`. Set the `PORT` environment variable to override.

## Endpoints

| Route | Description |
|---|---|
| `GET /` | Server-rendered schedule page |
| `GET /schedule.json` | Machine-readable schedule for the next 14 days |

### `GET /schedule.json`

Returns today's status and a 14-day schedule as JSON. Useful for AI agents, automations, and integrations.

```json
{
  "generated": "2026-06-10T14:00:00.000Z",
  "today": {
    "date": "2026-06-10",
    "status": "free"
  },
  "schedule": [
    { "date": "2026-06-10", "dayOfWeek": "Wed", "status": "free" },
    { "date": "2026-06-11", "dayOfWeek": "Thu", "status": "free" },
    ...
  ]
}
```

## Project structure

```
express-ssr/
├── server.ts          # Express app and route handlers
├── schedule.ts        # Schedule logic and data-building functions
├── views/
│   └── index.ejs      # EJS template (rendered server-side)
├── public/
│   └── style.css      # Styles (served as static files)
├── tsconfig.json
└── package.json
```

## AI agent metadata

The rendered page includes several machine-readable signals for AI agents and crawlers:

- `<meta name="description">` — states Aaron's status for today
- `<script type="application/ld+json">` — Schema.org `Dataset` structured data with schedule info and a link to `/schedule.json`
- `<link rel="alternate" type="application/json" href="/schedule.json">` — points crawlers to the JSON feed
- `data-date` and `data-status` attributes on every day cell
- An HTML comment near the top of `<body>` with a plain-text summary of the next 14 days
