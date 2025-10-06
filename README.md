# Alice in Wonderland — Interactive Story

An interactive, story-driven web experience inspired by Alice in Wonderland. This project is built with Vite, React, TypeScript, Tailwind CSS and includes small interactive mini-games and chapter-based content with an unlockable Wonderland Gallery.

## Features
- Multi-chapter interactive story with rich UI components
- Small canvas-style mini-games (keyboard controls)
- Chapter-based unlocking and a Wonderland Gallery that unlocks after chapters are completed

## Tech stack
- Vite (dev server & bundler)
- React 18 + TypeScript
- Tailwind CSS (styling)
- shadcn-ui / Radix UI components

## Prerequisites
- Node.js (recommended LTS: 18 or 20)
- npm (comes with Node) or Bun (optional)

Verify installed versions (PowerShell):
```powershell
node -v
npm -v
```

## Quick start (PowerShell)
1. Open PowerShell and change to the project folder (the folder that contains `package.json`):

2. Install dependencies:
```powershell
npm install
```
Or with Bun (if you prefer and have it installed):
```powershell
bun install
```
3. Start the development server:
```powershell
npm run dev
```
Open the Local URL printed by Vite (e.g. http://localhost:5173) in your browser.

## Build & Preview
Create a production build:
```powershell
npm run build
```
Preview the production build locally:
```powershell
npm run preview
```

## Available npm scripts
- `dev` — start Vite dev server
- `build` — production build
- `build:dev` — build with development mode
- `preview` — preview built output
- `lint` — run ESLint

## Project structure (key files)
- `index.html` — app entry
- `src/main.tsx` — React entry point
- `src/App.tsx` — application root
- `src/components/chapters/*` — chapter pages and the `WonderlandGallery`
- `src/components/MiniGame.tsx` — mini-game implementation
- `src/assets/` — images and static assets
- `package.json` — scripts & dependency list

## Game & UX notes
- Mini-games use keyboard arrow keys for controls and are driven by a requestAnimationFrame loop for smooth movement.

## Troubleshooting
- "Missing script: dev" — make sure you ran `npm run dev` from the folder that contains `package.json` (see Quick start above).
- Git errors (e.g., "not a git repository") — if you want to initialize a repo locally:
```powershell
git init
git add -A
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-remote-url>
git push -u origin main
```