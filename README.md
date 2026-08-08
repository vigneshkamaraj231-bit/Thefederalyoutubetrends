# The Federal — YouTube Trends

Editorial intelligence dashboard for discovering rising YouTube topics and content opportunities.

## What it does

- Pulls real YouTube Data API v3 `mostPopular` videos
- Filters by India, Global/US and UK
- Searches and filters live results
- Stores historical snapshots in PostgreSQL/Neon
- Calculates view-growth velocity between snapshots
- Provides a protected scheduled collector at `/api/cron`
- Surfaces rising videos and editorial opportunities

## Stack

- Next.js App Router
- React + TypeScript
- Neon PostgreSQL (`@neondatabase/serverless`)
- Vercel
- YouTube Data API v3

## Environment variables

Create these in Vercel → Settings → Environment Variables:

```text
YOUTUBE_API_KEY=your_google_cloud_youtube_api_key
DATABASE_URL=your_neon_postgres_connection_string
CRON_SECRET=a_long_random_secret
TRENDS_REGION=IN
```

Never commit real keys or database passwords to GitHub.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

Connect the GitHub repository to Vercel and deploy the `main` branch. Vercel Cron runs only on production deployments.

The repository uses a daily scheduled snapshot because Vercel Hobby cron is limited to daily schedules. If you need five-minute historical collection, upgrade the Vercel project or use an external scheduler to call `/api/cron` with the `CRON_SECRET` bearer token.

## API endpoints

- `GET /api/trends?region=IN` — latest trends
- `GET /api/trends?region=IN&q=cricket` — YouTube search
- `GET /api/trends?region=IN&history=true&hours=24` — historical snapshots
- `GET /api/cron` — protected scheduled snapshot collector
