# Mythical Recorder MVP

A lightweight browser-based screen recorder prototype built as a take-home MVP for Mythical Enterprises.

## What this delivers
- Screen capture using `getDisplayMedia`
- Optional microphone audio merge
- Live screen preview while recording
- Playback of finished recording
- Downloadable `.webm` recording file
- **Recording timer** with elapsed time display
- **Quality settings** (High/Medium/Low bitrate options)
- **Recording history** with localStorage persistence
- **Keyboard shortcuts** (Space to start/stop, Q to change quality)
- **Visual recording indicator** with pulse animation
- Responsive, clean UI with animations

## How to run locally
1. Open a terminal in this project folder.
2. Run a local server:
   - Python 3: `python3 -m http.server 8000`
   - Node: `npx serve .`
3. Open `http://localhost:8000` in a supported browser.

## Files
- `index.html` — MVP user interface with enhanced controls
- `style.css` — styling, animations, and responsive layout
- `app.js` — browser recording logic with advanced features
- `docs/reasoning.md` — product decision and roadmap documentation

## Premium Features Added
### Session Features
- **Real-time timer** showing elapsed recording time in MM:SS format
- **Visual recording indicator** with animated pulse to show active recording state
- **Quality selector** to choose bitrate (High VP9, Medium VP8, Low baseline)

### User Experience
- **Keyboard shortcuts**: Press Space to start/stop, Q to cycle through quality settings
- **Recording history** with localStorage — view all past recordings in the app
- **Quick actions**: Play, download, or delete any past recording from history
- **Recording metadata**: Duration, file size, timestamp for each recording

### Code Quality
- Proper error handling with user-friendly messages
- Browser compatibility checks and fallbacks
- Responsive design for mobile and desktop
- Clean separation of concerns in JavaScript

## Notes
This prototype is intentionally backend-free to validate the core experience quickly. It can be extended with storage, sharing, transcription, workspace history, and user accounts in a follow-up phase.

## Deployment
- This project is ready to deploy to GitHub Pages or Netlify.
- After pushing to GitHub, enable Pages from the repository settings or use the included GitHub Actions workflow.
