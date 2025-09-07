# LearnSphere

An AI-powered Learning Management System (LMS) that provides course management, quizzes, assignments, analytics, and integrated AI helpers for content generation and tutoring.

## Features
- Course creation, editing, and enrollment
- Quizzes: create, take, and review results
- Assignments: create and submissions tracking
- Grades and analytics dashboards
- Discussions and notifications
- Authentication with protected routes
- AI integrations: quiz generator and AI tutor (see `AI_FEATURES_README.md`)

## Tech Stack
- Client: React, Vite, Redux
- Server: Node.js, Express, MongoDB (Mongoose)
- Styling: Tailwind CSS
- AI: OpenAI API, LangChain

## Monorepo Structure
```
LearnSphere/
  client/          # React app (Vite)
  server/          # Node/Express API
  AI_FEATURES_README.md
  README.md
```

## Prerequisites
- Node.js 18+
- MongoDB database URI

## Environment Variables
Create the following files:

Root (optional, for shared tooling):
```
.env
```

Server (`server/.env`):
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Optional for AI features
OPENAI_API_KEY=your_openai_api_key
```

Client (`client/.env` - optional if using defaults):
```
VITE_API_BASE_URL=http://localhost:5000
```

## Setup
Install dependencies in both workspaces.

```
# In project root
cd server && npm install
cd ../client && npm install
```

## Run Locally
Start the API server (default http://localhost:5000) and the web app (default http://localhost:5173).

```
# Terminal 1 - API
cd server
npm run dev

# Terminal 2 - Web
cd client
npm run dev
```

## Useful Scripts
Server:
```
npm run dev        # start express with nodemon
npm start          # start express
```

Client:
```
npm run dev        # start Vite dev server
npm run build      # build for production
npm run preview    # preview production build
```

## AI Integrations (OpenAI + LangChain)
The platform leverages OpenAI and LangChain to power intelligent features:

- AI Quiz Generator: Generates quiz questions from course content or prompts
- AI Tutor: Assists learners with contextual Q&A and explanations

Implementation highlights:
- OpenAI API key is read from `server/.env` via `OPENAI_API_KEY`
- LangChain is used for prompt templating, chaining, and retrieval workflows
- Vector stores for retrieval live under `server/vectorstores/` (see repo)
- Service and controller logic reside in `server/services/` and `server/controllers/`

For detailed setup, prompts, and usage, see `AI_FEATURES_README.md`.

## Production Build
```
cd client && npm run build
# Serve client `dist/` via your hosting or a static server
# Deploy server separately (set env vars and start)
```

## Notes
- AI setup details live in `AI_FEATURES_README.md`.
- Binary, build, and environment files are ignored via `.gitignore`.

## License
This project is licensed under the terms of the LICENSE file in this repository.
