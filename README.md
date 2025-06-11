![CI](https://github.com/npapamichael/currency-exchange-hub/actions/workflows/main.yml/badge.svg)

# Currency Exchange Rate Hub — Full Stack Developer Assessment

---

**Successfully implemented major core functionality:**

- Multi-API currency exchange hub (Frankfurter API, ExchangeRate API)
- Real-time rates retrieval with automatic periodic refresh (every 60 seconds)
- Front-end search, filtering, and visual rate change indicators (↑, ↓, →)
- CRUD UI for external API integrations with full backend & frontend synchronization
- Full backend REST API with Express & PostgreSQL
- Redis caching for latest exchange rates to reduce external API calls
- Docker Compose setup (Postgres + Redis + Backend + Frontend)
- GitHub Actions CI pipeline: backend + frontend install, build, and Docker image verification

---

## Core Tech Stack

| Layer     | Tech                         |
|-----------|------------------------------|
| Frontend  | React (Vite), Bootstrap      |
| Backend   | Node.js, Express             |
| Database  | PostgreSQL                   |
| Cache     | Redis                        |
| Containerization | Docker & Docker Compose |
| CI/CD     | GitHub Actions               |

---

##  Fully Implemented Features

###  Exchange Rates & Conversion

- Fully functional `GET /api/rates` endpoint
- Periodic automatic rate refresh (every 60 seconds)
- Exchange rates cache using Redis
- Currency converter with live rates (conversion fallback temporarily skipped)

###  Integration Management

- Complete integration CRUD:
  - Create, update, deactivate integrations
  - Searchable, styled form + live data table
- Data stored dynamically in PostgreSQL
- Seamless frontend-backend sync

###  Build & Deployment

- Fully Dockerized deployment for backend, frontend, Redis, and Postgres
- Docker Compose orchestration for simple startup
- CI pipeline building backend & frontend, and verifying Docker builds automatically on GitHub Actions

---

##  Skipped or Deferred Features

> While I focused heavily on fully delivering the most critical backend/frontend functionality, a few more advanced features were left for future improvement if time allowed:

| Deferred Feature | Current Status |
|-------------------|----------------|
| Full fallback system (dynamic plugin-based API switching) | ❌ Skipped |
| Monitoring & alerting | ❌ Skipped |
| Historical data storage | ❌ Skipped |
| Encrypted config/secrets | ❌ Skipped |
| Unit / Integration tests | ❌ Skipped |
| Full conversion endpoint (external API structure variance issue) | ❌ Skipped |

---

##  Repository Structure

currency-exchange-hub/
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── redisClient.js
│ ├── db.js
│ ├── integration.js
│ └── init.sql
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ └── pages/
│ ├── App.jsx
│ └── vite.config.js
├── .github/
│ └── workflows/
│ └── main.yml
├── docker-compose.yml
└── README.md

---

## Local Setup

### Prerequisites:
- Docker
- Docker Compose
- Node.js & npm (for frontend)

### Backend Environment Variables (`backend/.env`):
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=nikolas1234
DB_DATABASE=exchangehub
REDIS_URL=redis://redis:6379

### Run Entire System via Docker Compose:
docker-compose up --build

---

# API Reference
exchange Rates
Method	Path	    Description
GET	    /api/rates	Retrieve latest exchange rates
GET	    /api/convert	(partially implemented, deferred)

# Integration Management
Method	Path	            Description
GET	    /api/integrations	Get all integrations
POST	/api/integrations	Create integration
PUT	    /api/integrations/:id	Update integration
DELETE	/api/integrations/:id	Deactivate integration

