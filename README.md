# Alice in Wonderland — Interactive Story

An interactive, story-driven web experience inspired by Lewis Carroll’s Alice in Wonderland. The project uses modern frontend tooling and provides chapter-based narratives, animated illustrations, and lightweight in-browser mini-games. An optional AI-backed chatbot server (the “Cheshire Guide”) can be run locally to provide contextual help.

This document is a concise developer and contributor guide covering setup, usage, the chatbot server, environment variables, troubleshooting, and deployment notes.

## Contents
- Project overview
- Features
- Tech stack
- Requirements
- Installation
- Configuration (env)
- Development (run & test)
- Website — user guide
- Chatbot server — setup & run
- Troubleshooting
- Build & deployment
- Useful commands
- Contributing


## Features
- Multi-chapter interactive story with illustrations and transitions
- Mini-games and interactive elements (keyboard controls)
- Sequential chapter unlocking (complete mini-game to progress)
- Wonderland Gallery to view unlocked artwork
- Optional AI Chatbot (the Cheshire Guide) for contextual help


## Tech stack
- Vite — development server and build tool
- React 18 + TypeScript — UI and type safety
- Tailwind CSS — utility-first styling
- shadcn-ui / Radix UI — accessible UI primitives


## Requirements
- Node.js (recommended LTS: 18 or 20)
- npm (included with Node) — or Bun (optional)

Verify your environment (PowerShell):

```powershell
node -v
npm -v
```


## Installation

1. Clone the repository and change into the project root (folder with `package.json`).

```powershell
Set-Location C:\path\to\alice-in-wonderland
```

2. Install frontend dependencies:

```powershell
npm install
```

3. (Optional) Install server dependencies for the chatbot:

```powershell
Set-Location server
npm install
Set-Location ..\
```

If you use Bun, replace `npm install` with `bun install`.


## Configuration (environment variables)

There are two places to configure environment variables:

- Frontend (Vite) — values that may be read by client code (must be safe for exposure).
- Server (Express chatbot) — secret keys and runtime options.

Frontend example (create `.env.local` in project root for development):

```properties
# Where the frontend should send chat requests in development
VITE_CHAT_ENDPOINT=http://localhost:8787
```

Server example (`server/.env` — create from `server/.env.example`):

```properties
# Primary: OpenAI API key used for REST fallback
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Google GenAI key (if you want to use Google's SDK path)
GOOGLE_API_KEY=AIzaSy...

# Development helpers
DEV_CSP_RELAX=1
PORT=8787
```

Notes:
- Never commit `.env` files containing secrets. Use `.gitignore` to exclude them.
- The server will print a warning if `OPENAI_API_KEY` is unset. If you rely on OpenAI, set it before starting the server.


## Development — run & test

Frontend (development):

```powershell
# From the repository root
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Chatbot server (optional):

```powershell
Set-Location server
# Auto-reloading server (requires nodemon in devDependencies):
npm run dev

# Or run directly with Node:
npm start
Set-Location ..\
```

If Windows reports `'nodemon' is not recognized'`, run `npm install` inside the `server` folder or use `npm start`.


## Production / preview

Build the frontend:

```powershell
npm run build
```

Preview locally:

```powershell
npm run preview
```

Run the server in production (example):

```powershell
Set-Location server
# Ensure environment variables are configured in server/.env or in your host
node index.js
```


## Website — user guide

This section explains how the interactive experience works from a user’s perspective.

Starting the experience
- Open the site in a modern desktop or mobile browser. Click the "Begin the Adventure" button on the homepage to start.

Chapter flow
- The content is split into sequential chapters. Chapter 1 is unlocked by default. Completing the mini-game at the end of a chapter unlocks the next one.
- Use the top navigation bar to jump between chapters you have already unlocked.

Mini-games and controls
- Mini-games are keyboard-driven (arrow keys) and present on-screen instructions when active.
- If a mini-game does not respond, ensure the tab is focused and your browser allows keyboard input.

Progress persistence
- The app stores unlocked chapters and gallery progress in the browser's local storage. Clearing browser storage will reset progress.

Accessibility notes
- UI components use Radix primitives for accessibility. If you encounter issues with assistive technologies, please open an issue with detailed reproduction steps.


## Chatbot server — setup and usage

The chatbot server (the Cheshire Guide) is a small Express app that exposes a POST `/chat` endpoint. The frontend sends JSON `{ message: string }` and receives `{ reply: string }`.

Backend behavior and fallbacks
- If `GOOGLE_API_KEY` is present and the Google GenAI SDK initializes successfully, the server will try Google GenAI.
- If `langchain` modules are installed, the server may use langchain.
- Otherwise the server uses OpenAI Chat Completions via `OPENAI_API_KEY` as a REST fallback.

Required configuration
- Create `server/.env` and populate at least `OPENAI_API_KEY` (or `GOOGLE_API_KEY` if using Google GenAI).
- Optionally set `PORT` to change the listening port (default 8787).

Start the server

```powershell
Set-Location server
npm install   # one-time
npm run dev   # uses nodemon for auto-reload
# or run in production mode
npm start
Set-Location ..\
```

Verify the server
- Visit `http://localhost:8787/` in a browser; it should respond with a tiny health message.

Connect the frontend
- Ensure `VITE_CHAT_ENDPOINT` in the frontend env points to the running server, e.g. `http://localhost:8787`.
- The Chatbot component posts to `${VITE_CHAT_ENDPOINT}/chat`.

Security
- Keep `OPENAI_API_KEY` and `GOOGLE_API_KEY` only on the server. Never expose them to client-side code.
- For production, use a secure secrets manager rather than committing `.env` files.


## Troubleshooting

- "vite is not recognized" when running `npm run dev`
	- Run `npm install` in the repo root to install devDependencies. Vite's executable is located at `node_modules/.bin/vite`.
	- As an alternative: `npx vite`.

- "nodemon is not recognized" when running `server/npm run dev`
	- Run `npm install` in the `server` directory to install devDependencies (including nodemon), or use `npm start`.

- Port already in use (EADDRINUSE)
	- Change `PORT` in `server/.env` or stop the process using the port:

```powershell
netstat -ano | findstr :8787
taskkill /PID <pid> /F
# Or in PowerShell
Get-Process -Id <pid> | Stop-Process -Force
```

- OpenAI / GenAI errors
	- Check that `server/.env` contains valid keys and that your account has access to the requested models.
	- Inspect server logs for HTTP error bodies returned by the AI provider.


## Build & deployment

Create a production build:

```powershell
npm run build
```

Deploy the `dist/` folder to your chosen static host (Netlify, Vercel, GitHub Pages, etc.). This repository includes a `deploy` script that uses `gh-pages` — review `package.json` before using it.

Server deployment:

- Use a process manager (PM2, systemd) or containerize the server. Configure secrets in your host's environment management rather than committing `.env` files.
- Ensure HTTPS and proper access control when exposing the chatbot API.


## Useful commands

PowerShell snippets for common tasks:

```powershell
# Root
npm install
npm run dev         # start frontend dev server
npm run build
npm run preview
npm run lint

# Server
Set-Location server
npm install
npm run dev         # nodemon (auto-reload)
npm start           # node index.js
Set-Location ..\
```


## Contributing

Contributions are welcome. To contribute:

1. Open an issue describing the change or bug.
2. Fork the repository and create a branch for your changes.
3. Make changes, run linters/tests, and open a pull request with a clear description and rationale.

Important files and locations
- `server/index.js` — Express chatbot server and `/chat` endpoint
- `src/components/chapters/Hero.tsx` — frontend uses `VITE_CHAT_ENDPOINT` fallback
- `src/components/Chatbot.tsx` — Chatbot UI component (if included)

If you want a condensed quickstart added to the top of this README, tell me the preferred level of detail and I will add it.

