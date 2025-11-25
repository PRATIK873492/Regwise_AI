# Regwise Backend

## Setup
1. Copy .env.example -> .env and fill values.
2. `npm install`
3. `npm run dev` (development) or `npm run build && npm start` (production)

## Endpoints
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/users/me
- GET/POST/PUT/DELETE /api/items
- POST /api/upload (multipart/form-data, field: file)
- POST /api/ai/prompt (proxy to OpenAI if configured)
