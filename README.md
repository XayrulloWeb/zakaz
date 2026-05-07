# AI Arch Edu Deployment

Frontend: Netlify  
Backend: Render

## 1) Backend on Render

Repository already includes [render.yaml](/c:/Users/user/Desktop/zakaz/render.yaml).

Create a new **Web Service** in Render from this repo and confirm:

- `Root Directory`: `backend`
- `Build Command`: `npm install && npx prisma generate`
- `Start Command`: `npx prisma db push && npm start`
- `Health Check Path`: `/api/health`

Set environment variables in Render:

- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET`
- `GEMINI_API_KEY` (or `GEMINI_API_KEYS`)
- `GEMINI_MODEL` / `GEMINI_MODELS` (optional)
- `CLIENT_URLS` = your Netlify frontend URL(s), comma-separated
  Example: `https://your-site.netlify.app,https://www.your-domain.com`

## 2) Frontend on Netlify

Repository already includes [netlify.toml](/c:/Users/user/Desktop/zakaz/netlify.toml).

Create a new **Site from Git** in Netlify and verify:

- `Base directory`: `frontend`
- `Build command`: `npm run build`
- `Publish directory`: `dist`

Set environment variable in Netlify:

- `VITE_API_BASE_URL` = your Render backend URL  
  Example: `https://ai-arch-backend.onrender.com`

## 3) Final check

1. Open frontend URL and register/login.
2. Open `/chatbot`.
3. Send text and image requests.
4. Check backend health: `https://<render-service>/api/health`.
