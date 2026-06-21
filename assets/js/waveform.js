/**
 * waveform.js — Live oscilloscope animation for the About section
 *
 * Renders a composite sensor signal (like a pump suction pressure channel)
 * with:
 *  - Cyan primary signal with low-frequency drift
 *  - Upper/Lower control limit dashed lines (UCL / LCL)
 *  - Occasional anomaly bursts in orange
 *  - Oscilloscope grid background
 *  - Scrolling cursor readout
 *
 * To modify: adjust FREQ_*, AMP, or anomalyThreshold below.
 */

const FREQ_PRIMARY   = 1.1;  // base oscillation rate
const FREQ_HARMONIC  = 3.7;  // harmonic overlay
const AMP            = 68;   // amplitude in canvas pixels
const ANOMALY_THRESH = 0.72; // 0–1, lower = more frequent anomalies

export class WaveformCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.W      = canvas.width;
    this.H      = canvas.height;
    this.time   = 0;

    this._animate();
  }

  _draw() {
    const { ctx, W, H, time } = this;

    // ── Background ────────────────────────────────────────────────────────
    ctx.fillStyle = '#0D1B2A';
    ctx.fillRect(0, 0, W, H);

    // ── Oscilloscope grid ─────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
    ctx.lineWidth   = 1;
    const gridX = 56, gridY = 40;
    for (let x = 0; x <= W; x += gridX) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += gridY) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // ── Centre zero-line ──────────────────────────────────────────────────
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── UCL / LCL threshold lines ─────────────────────────────────────────
    const drawLimit = (yFrac, label) => {
      const y = H * yFrac;
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.38)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255, 107, 53, 0.65)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(label, 8, y - 4);
    };
    drawLimit(0.18, 'UCL +3σ');
    drawLimit(0.82, 'LCL −3σ');

    // ── Signal drawing helper ─────────────────────────────────────────────
    const drawWave = (color, alpha, f1, f2, amp, phase) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth   = 1.8;
      for (let x = 0; x < W; x++) {
        const t  = (x / W) * Math.PI * 8;
        const y  = H / 2
          - amp * Math.sin(t * f1 + time * 2.2 + phase)
          - (amp * 0.28) * Math.sin(t * f2 + time * 1.5 + phase * 0.6);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // Primary sensor signal
    drawWave('#00E5FF', 0.9, FREQ_PRIMARY, FREQ_HARMONIC, AMP, 0);

    // Anomaly burst (orange, sporadic)
    const anomalyStrength = (Math.sin(time * 0.38) + 1) * 0.5; // 0–1
    if (anomalyStrength > ANOMALY_THRESH) {
      const a = ((anomalyStrength - ANOMALY_THRESH) / (1 - ANOMALY_THRESH)) * 0.7;
      drawWave('#FF6B35', a, 2.3, 6.8, AMP * 0.45, Math.PI / 2.5);
    }

    // ── Scrolling cursor ──────────────────────────────────────────────────
    const cursorX = ((time * 38) % (W + 60)) - 30;
    if (cursorX > 0 && cursorX < W) {
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
      ctx.lineWidth   = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(cursorX, 0); ctx.lineTo(cursorX, H); ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── HUD labels ────────────────────────────────────────────────────────
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(136, 146, 176, 0.55)';
    ctx.fillText('0.043 Hz  ·  PUMP_SUCTION  ·  Δt = 23.3s', 8, H - 8);

    const liveVal = (AMP * 0.6 * Math.sin(time * 2.2)).toFixed(1);
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'right';
    ctx.fillText(`${liveVal > 0 ? '+' : ''}${liveVal} psi`, W - 10, H - 8);
    ctx.textAlign = 'left';
  }

  _animate() {
    this.time += 0.018;
    this._draw();
    requestAnimationFrame(() => this._animate());
  }
}
