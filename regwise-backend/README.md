# Regwise Backend

## Setup

1. Copy .env.example -> .env and fill values.
2. Start a local MongoDB instance (we recommend the docker-compose below) or set MONGO_URI to a hosted MongoDB URI.
3. `npm install`
4. `npm run dev` (development) or `npm run build && npm start` (production)

### Docker (recommended for local development)

Create and start a local MongoDB by running the Docker Compose from the repo root:

```powershell
docker compose up -d
```

By default the Compose file exposes a MongoDB instance at `mongodb://root:example@localhost:27017/regwise?authSource=admin`.

Set the `MONGO_URI` in `.env` to that connection string, then run the seed script:

```powershell
cd regwise-backend
npm run seed
```

This will populate `countries` from `regwise-backend/data/countries.json` into the newly created DB.

To seed sample alerts for development testing, run:

```powershell
npm run seed:alerts
```

## Endpoints

- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/users/me
- GET/POST/PUT/DELETE /api/items
- POST /api/upload (multipart/form-data, field: file)
- POST /api/ai/prompt (proxy to OpenAI if configured)
