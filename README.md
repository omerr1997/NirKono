# NirKono

Hello World baseline deployed with GitHub-backed Vercel deployment and a Vercel Marketplace Neon database.

## Local Development

```bash
npm install
npm run dev
```

The app renders a simple `Hello World` page. The `/api/db` endpoint checks the Neon connection when Vercel injects `DATABASE_URL` or `POSTGRES_URL`.
