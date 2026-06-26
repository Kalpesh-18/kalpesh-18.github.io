/**
 * main.js — Entry point
 *
 * Imports and initializes every module in one place.
 * To add a new feature: write it in its own file, export a function,
 * import it here, and call it inside init().
 *
 * Load order:
 *   1. NeuralScene  — Three.js 3D background (heavyweight, first)
 *   2. WaveformCanvas — Canvas 2D oscilloscope in About section
 *   3. initNav      — Navbar scroll + mobile toggle
 *   4. initScrollReveal — Fade-in animations on scroll
 *   5. initCounters — Hero stat number animation
 *   6. initSkillBars — Skill bar fill animation
 */

import { NeuralScene }     from './scene.js';
import { WaveformCanvas }  from './waveform.js';
import {
  initNav,
  initScrollReveal,
  initCounters,
  initSkillBars,
  initLeetcodeDashboard,
} from './animations.js';

function init() {
  // ── 3D neural network background ────────────────────────────────────────
  const neuralCanvas = document.getElementById('neural-canvas');
  if (neuralCanvas) {
    new NeuralScene(neuralCanvas);
  }

  // ── About section waveform ───────────────────────────────────────────────
  const waveCanvas = document.getElementById('waveform-canvas');
  if (waveCanvas) {
    new WaveformCanvas(waveCanvas);
  }

  // ── UI animations ────────────────────────────────────────────────────────
  initNav();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initLeetcodeDashboard();
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
