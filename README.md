# Kalpesh Ahire — 3D Data Scientist Portfolio

A modular, GitHub Pages-ready portfolio with a **"Signal & Noise"** aesthetic —
dark oscilloscope grid, Three.js neural network background, and live sensor
waveform — built around a data scientist's actual world.

---

## File Structure

```
portfolio/
├── index.html                  ← All sections live here
├── README.md
└── assets/
    ├── css/
    │   └── style.css           ← All styles (CSS custom properties at the top)
    └── js/
        ├── main.js             ← Entry point — imports & calls everything
        ├── scene.js            ← Three.js 3D neural network background
        ├── waveform.js         ← Canvas 2D oscilloscope in About section
        └── animations.js       ← Nav, scroll reveals, counters, skill bars
```

---

## Deploy to GitHub Pages (2 minutes)

1. **Create a repo** at github.com — name it anything (e.g. `portfolio`)
2. **Push this folder**:
   ```bash
   git init
   git add .
   git commit -m "init portfolio"
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```
3. **Enable Pages**: Settings → Pages → Source → Deploy from branch → `main` / `/ (root)`
4. Your site is live at `https://YOUR_USERNAME.github.io/portfolio/`

> No build step, no npm install, no config — it's plain HTML/CSS/JS with CDN imports.

---

## How to Add a New Section

### 1. Add the HTML block in `index.html`

Copy any existing `<section class="section">` block and place it where you want it.
Each section follows this pattern:

```html
<section id="your-section" class="section">
  <div class="container">
    <div class="section-label font-mono">/ your-section</div>
    <h2 class="section-title reveal">Section Title</h2>

    <!-- your content here — add .reveal to elements you want to animate in -->
    <div class="reveal">
      ...
    </div>

  </div>
</section>
```

Add a nav link in the `<ul class="nav-links">` block.

### 2. Add styles in `style.css`

Find the `/* SKILLS */` block near the bottom and add your styles below it,
following the same comment-header pattern:

```css
/* ============================================
   YOUR SECTION
   ============================================ */
#your-section { ... }
```

### 3. Add behavior in `animations.js` (if needed)

Write and export a new function:

```js
export function initYourSection() {
  // ...
}
```

Import and call it in `main.js`:

```js
import { ..., initYourSection } from './animations.js';
// inside init():
initYourSection();
```

---

## Customising the Design

| What                  | Where                                      |
|-----------------------|--------------------------------------------|
| Colors / fonts        | `:root` block at the top of `style.css`    |
| 3D network density    | `NODE_COUNT`, `SPREAD`, `CONNECT_DIST` in `scene.js` |
| Waveform signal shape | `FREQ_*`, `AMP`, `ANOMALY_THRESH` in `waveform.js`  |
| Skill levels          | `data-level` attributes on `.skill-bar` in `index.html` |
| Stat counter values   | `data-target` attributes on `.stat-value` in `index.html` |

---

## Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| 3D scene   | [Three.js r128](https://threejs.org/) via CDN ES module |
| Animations | Vanilla JS + Intersection Observer API                  |
| Waveform   | Canvas 2D API                                           |
| Fonts      | Google Fonts (Space Grotesk · Inter · JetBrains Mono)  |
| Hosting    | GitHub Pages (static, no server)                        |
