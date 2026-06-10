import express, { Request, Response } from 'express'
import path from 'path'
import { isAaronFree, buildWeekList, buildScheduleJson } from './schedule'

const app = express()
const PORT = process.env.PORT ?? 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req: Request, res: Response) => {
  const today = new Date()
  const todayFree = isAaronFree(today)
  const todayDateStr = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const todayIso = today.toISOString().split('T')[0]
  const weeks = buildWeekList(today)
  const upcomingDays = buildScheduleJson(today)

  const metaDescription = `Aaron is ${todayFree ? 'free' : 'working'} today (${todayDateStr}). Check Aaron's work schedule for any date.`

  // JSON-LD structured data for AI agents and search engines
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: "Aaron's Work Schedule",
    description: metaDescription,
    url: `${req.protocol}://${req.get('host')}/`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Person', name: 'Aaron' },
    temporalCoverage: `${todayIso}/..`,
    variableMeasured: {
      '@type': 'PropertyValue',
      name: 'availability',
      description:
        'Whether Aaron is free (not working) or working on a given date',
      unitText: 'free | working',
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${req.protocol}://${req.get('host')}/schedule.json`,
      description: 'Machine-readable schedule for the next 14 days',
    },
  })

  res.render('index', {
    today,
    todayFree,
    todayDateStr,
    todayIso,
    weeks,
    upcomingDays,
    metaDescription,
    jsonLd,
  })
})

// Machine-readable schedule endpoint for AI agents and integrations
app.get('/schedule.json', (_req: Request, res: Response) => {
  const today = new Date()
  const days = buildScheduleJson(today)
  res.json({
    generated: today.toISOString(),
    today: {
      date: today.toISOString().split('T')[0],
      status: isAaronFree(today) ? 'free' : 'working',
    },
    schedule: days,
  })
})

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
