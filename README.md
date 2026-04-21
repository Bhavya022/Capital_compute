# Mythical Recorder MVP

A lightweight browser-based screen recorder prototype built as a take-home MVP for Mythical Enterprises.

## What this delivers
- Screen capture using `getDisplayMedia`
- Optional microphone audio merge
- Live screen preview while recording
- Playback of finished recording
- Downloadable `.webm` recording file
- Responsive, clean UI for a quick product demo

## How to run locally
1. Open a terminal in this project folder.
2. Run a local server:
   - Python 3: `python3 -m http.server 8000`
   - Node: `npx serve .`
3. Open `http://localhost:8000` in a supported browser.

## Files
- `index.html` — MVP user interface
- `style.css` — styling and layout
- `app.js` — browser recording logic
- `docs/reasoning.md` — product decision and roadmap documentation

## Notes
This prototype is intentionally backend-free to validate the core experience quickly. It can be extended with storage, sharing, transcription, workspace history, and user accounts in a follow-up phase.

## Deployment
- This project is ready to deploy to GitHub Pages or Netlify.
- After pushing to GitHub, enable Pages from the repository settings or use the included GitHub Actions workflow.
