📌 Project — Pastebin-Lite

A minimal Pastebin-like web application where users can:
- Create a text paste
- Receive a shareable link
- View the paste using that link

Pastes may optionally expire based on:

- time-to-live (TTL), or
- maximum number of views

A paste becomes unavailable as soon as either constraint is triggered.

This project is implemented using Node.js + Express + Prisma + Neon Postgres and deployed on Vercel.

🚀 Deployed Application

Production URL:

👉 https://paste-bin-list.vercel.app/

Health check:

👉 https://paste-bin-list.vercel.app/api/healthz

🧠 Tech Stack:
Node.js + Express,
Prisma ORM,
Neon Serverless Postgres (persistent DB),
pg + Prisma serverless adapter,
Vercel Serverless Functions deployment

No in-memory storage is used — data persists across requests and redeploys.

🗄️ Persistence Layer
The application uses:

Neon Postgres + Prisma ORM - with the @prisma/adapter-pg serverless adapter.

This ensures:
- works reliably in Vercel serverless runtime
- database connections are pooled safely
- Prisma client is reused across invocations
- no global mutable state
- persistence survives redeploys

Prisma model:

model Paste {
  id         String   @id @default(uuid())
  content    String
  createdAt  DateTime @default(now())
  ttlSeconds Int?
  maxViews   Int?
  usedViews  Int      @default(0)
}

🧪 Deterministic Expiry Testing

Automated tests require deterministic time control.

When:

 TEST_MODE=1

expiry logic uses the header:

 x-test-now-ms: <milliseconds since epoch>

If the header is not present, real system time is used.
This allows TTL behaviour to be tested consistently.

🛠️ Running Locally
1️⃣ Clone repository
- git clone <repo-url>
- cd pastebin-lite

2️⃣ Install dependencies
- npm install

3️⃣ Create .env
- DATABASE_URL=postgresql://<neon-connection>
- PORT=3000
- TEST_MODE=0

4️⃣ Push Prisma schema (creates DB table)
- npx prisma db push

5️⃣ Start development server
- npm run dev

Server runs at:
- http://localhost:3000

📡 API Endpoints
✅ Health Check
- GET /api/healthz

Returns DB status:

 { "ok": true }

✍️ Create Paste
- POST /api/pastes

Request body:

 {
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}


Validation rules:

- content must be a non-empty string
- ttl_seconds must be integer ≥ 1 (optional)
- max_views must be integer ≥ 1 (optional)

Response (2xx):

 {
  "id": "uuid",
  "url": "https://paste-bin-list.vercel.app/p/<id>"
}

Invalid input → returns 4xx JSON.

👁️ Fetch Paste (API)
- GET /api/pastes/:id

Response:

 {
  "content": "string",
  "remaining_views": 3,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


Notes:
- Each API fetch counts as a view
- remaining_views = null if unlimited
- expires_at = null if no TTL

Unavailable (missing / expired / view-limit reached):

404 JSON

🌐 View Paste (HTML)
- GET /p/:id

Returns:
- safe HTML page
- text content wrapped in pre tag
- prevents script execution

Unavailable → returns 404.

⚙️ Expiry & Constraint Behaviour

A paste becomes unavailable when:
- TTL expires OR
- max view count is reached

The first condition that triggers wins.

Additional guarantees:

- no negative remaining view counts
- Every successful fetch increments count
- behaviour is concurrency-safe
- Multiple requests cannot bypass expiry

🧾 Key Design Decisions
- Neon Postgres selected to satisfy persistence requirement
- Prisma serverless adapter prevents connection leaks
- Prisma instance reused across lambda invocations
- No global mutable in-memory state
- Expiry logic centralised in a shared utility
- Deterministic testing supported (TEST_MODE mode)
- API + HTML view routes kept separate
