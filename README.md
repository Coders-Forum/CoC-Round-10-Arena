# Clash of Coders — Arena Showcase

A 3D interactive arena selection experience built with React and Three.js. Scroll through 25 uniquely themed battle arenas — each inspired by real-world landmarks and mythologies — designed for a college coding competition event.

Live Demo → [clash-of-coders.github.io](https://github.com/Game_Contest/clash-of-coders) *(update with your actual gh-pages URL)*

---

## What It Is

A fullscreen scroll experience where each arena is rendered as a live 3D model with custom lighting, paired with a floating info card showing the arena name, difficulty, algorithmic theme, and tags. 25 arenas total spanning:

Volcano · Frozen Peaks · Jungle Isle · Island Shores · Coliseum · Desert Pyramid · Castle Fortress · Ancient Ruins · Mayan Temple · Greek Temple · Korean Pagoda · Stone Pedestal · Santorini · Lantern Gate · Rock Fort · Shaolin Temple · Barracks · The Palace · Japanese Shrine · Norwegian Dead Forest · Saint Basil's Cathedral · Arc de Triomphe · Necropolis · Cemetery · Pillars of Eternity

---

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 19 |
| 3D Renderer | Three.js + @react-three/fiber |
| 3D Helpers | @react-three/drei |
| Post Processing | @react-three/postprocessing |
| Build Tool | Vite 7 |
| Deployment | gh-pages |

---

## Project Structure

```
clash-of-coders/
├── public/
│   ├── models/          # 25 .glb arena models
│   └── audio/           # Battle background music
├── src/
│   ├── lands/           # One component per arena (25 files)
│   ├── scene/
│   │   ├── Scene.jsx        # Main scroll layout, all arenas wired together
│   │   ├── SceneWrapper.jsx
│   │   ├── CameraRig.jsx
│   │   ├── Embers.jsx
│   │   ├── FloatingRocks.jsx
│   │   └── Snowflakes.jsx
│   ├── ui/
│   │   ├── ArenaCard.jsx    # Floating info card with glow animations
│   │   ├── AudioPlayer.jsx  # Background music player
│   │   ├── LazyCanvas.jsx   # Lazy-loaded Three.js canvas per arena
│   │   └── PathOverlay.jsx
│   ├── data/
│   │   └── lands.js         # Arena metadata (titles, tags, descriptions)
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Install & Run

```bash
git clone https://github.com/<your-username>/clash-of-coders.git
cd clash-of-coders
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

This runs `vite build` and pushes the `dist/` folder to the `gh-pages` branch automatically.

---

## Performance Notes

- Each arena uses a `LazyCanvas` wrapper — Three.js canvases only mount when scrolled into view, keeping initial load fast
- DPR capped at `[1, 1]` and antialiasing disabled for GPU efficiency
- `powerPreference: "high-performance"` set on the WebGL context
- 25 GLB models are served statically from `/public/models/` — no runtime fetching overhead

---

## Dependencies

```bash
npm install
```

All dependencies are declared in `package.json`. No manual installs needed.

| Package | Purpose |
|---|---|
| `three` | Core 3D engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers (loaders, controls, etc.) |
| `@react-three/postprocessing` | Visual effects pipeline |
| `react` + `react-dom` | UI framework |

---

## Arena Card System

Each arena uses the `ArenaCard` component which accepts:

| Prop | Type | Description |
|---|---|---|
| `side` | `"left"` \| `"right"` | Which side the card floats on |
| `title` | string | Arena name |
| `subtitle` | string | Difficulty label |
| `description` | string | Flavour text |
| `tags` | string[] | Algorithm tags shown as chips |
| `accentColor` | hex string | Card border and text accent |
| `glowColor` | hex string | Glow/shadow color |

---

## License

MIT — built for Coders Forum, Panimalar Engineering College.