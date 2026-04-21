# Mythical Recorder MVP — Reasoning & Roadmap

## 1. What this take-home test delivers
This prototype focuses on the highest-value core of a Loom-like product: capture the screen, optionally include microphone audio, preview the recording, and export the result.

### Delivered features
- Screen recording in the browser
- Microphone audio when available
- Live preview while recording
- Playback of the completed recording
- Downloadable video asset
- Simple and polished UI to show the experience clearly

## 2. How I decided what needs to be covered in 2 days
### Core objective
The most important thing is to prove the product concept quickly and reliably. For a screen recorder, that means validating:
- Screen capture works
- The user knows when recording is active
- The recording can be reviewed immediately
- The output can be downloaded or shared

### Priority rationale
1. **Functionality first**: build a working recording flow without backend dependencies.
2. **Usability second**: make the UI clear, simple, and trustworthy.
3. **Reliability third**: handle browser support gracefully and provide recoverable messaging.

### 2-day scope
- Set up a static web UI with record / stop / download controls
- Use web-standard APIs (`getDisplayMedia`, `MediaRecorder`)
- Support mic audio and screen video together
- Provide a clean on-screen preview and playback experience
- Document assumptions, trade-offs, and next steps

## 3. What should be covered in the coming 2 weeks
### Week 1 — Product polish and essential infrastructure
- Deploy a public preview (GitHub Pages, Vercel, Netlify)
- Add user onboarding and flow for first-time use
- Save recordings to browser storage and allow quick retry
- Build a minimal backend service for sharing links
- Add a basic recording library / history page

### Week 2 — Growth features and reliability
- Add user accounts / authentication
- Add webcam overlay and recording layout controls
- Add automatic transcription and searchable captions
- Introduce recording metadata and sharing URLs
- Add support for fast browser previews and cloud storage

### Minimal viable product after 2 weeks
- Hosted web app with signup
- Screen + mic + optional webcam capture
- Download and share recording links
- Recording history and playback
- Basic transcription and note generation

## 4. Engineering trade-offs
### Browser-native MVP vs native desktop app
Using the browser minimizes time to ship and avoids installation friction, but it limits advanced recording options and file formats.

### No backend vs build backend
For a 2-day MVP, it's essential to prove the capture flow without building file storage. This prototype is intentionally backend-free. In a longer phase, a small backend can unlock sharing, persistence, and access control.

### File format and codec
The prototype uses `video/webm` for compatibility with browser `MediaRecorder`. For a production release, a server-side conversion to MP4 / H.264 may be needed for broader playback support.

### AI usage opportunity
This demo is intentionally focused on execution. AI can be introduced in later stages for:
- auto-generated summaries of recordings
- transcription and keyword extraction
- smart clip creation from long sessions
- product analytics and user prompts

## 5. Recommended next milestones
1. Deploy the prototype so stakeholders can open a live link.
2. Add sharing and persistence.
3. Build a small backend that stores recordings and generates share URLs.
4. Add webcam overlay and session metadata.
5. Add transcription / subtitles and AI-generated summary cards.

---

### Summary
This take-home MVP shows the key product idea immediately. It keeps engineering risk low by using browser APIs and a static app shell, while leaving a clear 2-week roadmap for sharing, user accounts, and AI-enabled value.
