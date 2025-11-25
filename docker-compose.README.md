# Docker Compose: Regwise AI (MongoDB + Backend + Frontend)

This file helps you run the full stack (MongoDB, backend, and frontend) using Docker Compose for local development.

Requirements
- Docker Engine and Docker Compose (Docker Desktop)

How to run
1. Start Docker Desktop.
2. From repository root (where `docker-compose.yml` is), run:
```
docker compose up --build
```
3. The services will be available at:
- Frontend (nginx): http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: exposed on 27017

Notes
- The frontend is built and served by nginx. The Vite environment variable `VITE_API_BASE_URL` is baked into the frontend build by the build arg in `docker-compose.yml` (default: `http://localhost:5000/api`).
- Backend uses `FRONTEND_ORIGIN=http://localhost:3000` to enable CORS for the front-end. Change as needed for production.
- You should copy `regwise-backend/.env.example` to `regwise-backend/.env` and set values for `MONGO_URI`, `JWT_SECRET`, and other secrets. The compose file sets env vars for convenience but you may prefer to use `.env` files and Docker secrets.

Stopping the stack
```
docker compose down
```

Testing
- Health check: `curl http://localhost:5000/api/health` (should return {ok: true})
- Open `http://localhost:3000` in your browser and perform actions that make HTTP requests to the backend.
