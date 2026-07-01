# 🧠 AGENT PROMPT — Glassmorphic Premium Design for Modelfight

> You are upgrading the **Modelfight** React + Vite + Tailwind CSS app into the most premium, stunning glassmorphic website possible. The branch name is `glassmorphic-premium`. Follow every instruction below precisely.

---

## 📦 STEP 1 — Install Dependencies

```bash
npm install framer-motion
npm install canvas-confetti
npm install @tsparticles/react @tsparticles/slim
npm install react-hot-toast
```

---

## 🎨 STEP 2 — Design Tokens (index.css)

Replace the `:root` design tokens block with this upgraded version:

```css
:root {
  --bg-primary: #020408;
  --bg-secondary: #060d1a;
  --bg-tertiary: #0a1628;
  --bg-glass: rgba(255, 255, 255, 0.03);
  --bg-glass-hover: rgba(255, 255, 255, 0.07);

  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-bright: rgba(255, 255, 255, 0.18);
  --border-glow-blue: rgba(56, 189, 248, 0.5);
  --border-glow-purple: rgba(192, 132, 252, 0.5);
  --border-glow-pink: rgba(244, 114, 182, 0.5);

  --text-primary: #f0f6ff;
  --text-secondary: #94a3b8;
  --text-muted: #475569;

  --accent: #38bdf8;
  --accent-light: #7dd3fc;
  --accent-dark: #0284c7;
  --accent-glow: rgba(56, 189, 248, 0.35);
  --accent-glow-strong: rgba(56, 189, 248, 0.6);

  --accent-purple: #c084fc;
  --accent-purple-glow: rgba(192, 132, 252, 0.35);
  --accent-pink: #f472b6;
  --accent-pink-glow: rgba(244, 114, 182, 0.35);

  --gradient-hero: linear-gradient(135deg, #38bdf8 0%, #c084fc 50%, #f472b6 100%);
  --gradient-a: linear-gradient(135deg, #38bdf8, #6366f1);
  --gradient-b: linear-gradient(135deg, #f472b6, #c084fc);

  --glass-blur: blur(24px);
  --glass-blur-heavy: blur(48px);

  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  --shadow-glow-blue: 0 0 40px rgba(56, 189, 248, 0.25);
  --shadow-glow-purple: 0 0 40px rgba(192, 132, 252, 0.25);

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-full: 9999px;

  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

---

## 🌌 STEP 3 — Background (index.css)

Replace the `.ambient-orbs`, `.orb`, `.orb-1`, `.orb-2`, `.orb-3` CSS with:

```css
.ambient-orbs {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.55;
  animation: floatOrb 25s infinite ease-in-out alternate;
}

.orb-1 {
  top: -15%;
  left: -10%;
  width: 55vw;
  height: 55vw;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.7) 0%, transparent 70%);
}

.orb-2 {
  bottom: -20%;
  right: -10%;
  width: 65vw;
  height: 65vw;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.55) 0%, transparent 70%);
  animation-delay: -8s;
}

.orb-3 {
  top: 35%;
  left: 25%;
  width: 45vw;
  height: 45vw;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, transparent 70%);
  animation-delay: -14s;
}

.orb-4 {
  top: 10%;
  right: 15%;
  width: 30vw;
  height: 30vw;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, transparent 70%);
  animation-delay: -4s;
}

@keyframes floatOrb {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(4%, 8%) scale(1.08); }
  66%  { transform: translate(-3%, 5%) scale(0.95); }
  100% { transform: translate(6%, -4%) scale(1.05); }
}

/* Noise grain overlay for premium texture */
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}

/* Animated grid lines background */
.grid-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}
```

Add `.orb-4`, `.noise-overlay`, and `.grid-overlay` divs inside `.ambient-orbs` in `App.jsx`.

---

## 💎 STEP 4 — Glass Panel Upgrade (index.css)

Replace `.glass-panel` with:

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.028);
  backdrop-filter: var(--glass-blur-heavy);
  -webkit-backdrop-filter: var(--glass-blur-heavy);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-xl);
  padding: 8px;
  box-shadow: var(--shadow-glass), 0 0 0 0.5px rgba(255,255,255,0.04) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  pointer-events: none;
}

.glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
  pointer-events: none;
  border-radius: inherit;
}

.glass-panel:focus-within {
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow: var(--shadow-glass), var(--shadow-glow-blue), 0 0 0 1px rgba(56, 189, 248, 0.2);
}
```

---

## 🔤 STEP 5 — Hero Section Upgrade (index.css)

Replace `.hero-title` with:

```css
.hero-title {
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.05;
  margin-bottom: 28px;
  text-align: center;
  background: var(--gradient-hero);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 60px rgba(56, 189, 248, 0.3));
  animation: titleGlow 4s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0%   { filter: drop-shadow(0 0 40px rgba(56, 189, 248, 0.3)); }
  50%  { filter: drop-shadow(0 0 80px rgba(192, 132, 252, 0.4)); }
  100% { filter: drop-shadow(0 0 40px rgba(244, 114, 182, 0.3)); }
}
```

---

## 🃏 STEP 6 — Battle Column Cards Upgrade (index.css)

Replace `.battle-column` with:

```css
.battle-column {
  flex: 1;
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow-glass);
}

.battle-column::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  pointer-events: none;
}

.battle-column:hover {
  border-color: var(--border-glass-bright);
  box-shadow: var(--shadow-glass), 0 20px 60px rgba(0,0,0,0.4);
  transform: translateY(-2px);
}

.battle-column.winner-column {
  border-color: var(--border-glow-blue);
  box-shadow: var(--shadow-glass), var(--shadow-glow-blue), 0 0 60px rgba(56, 189, 248, 0.15);
  animation: winnerPulse 2s ease-in-out infinite;
}

@keyframes winnerPulse {
  0%, 100% { box-shadow: var(--shadow-glass), 0 0 30px rgba(56, 189, 248, 0.2); }
  50%       { box-shadow: var(--shadow-glass), 0 0 60px rgba(56, 189, 248, 0.45); }
}

.battle-column.loser-column {
  opacity: 0.4;
  filter: grayscale(0.3);
  transform: scale(0.99);
}

.column-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-glass);
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(8px);
}
```

---

## 🔘 STEP 7 — Button Upgrades (index.css)

Replace `.vote-btn` and all `.vote-btn-*` variants with:

```css
.vote-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: var(--radius-lg);
  font-family: var(--font-family);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Shimmer sweep on hover */
.vote-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.vote-btn:hover::after {
  left: 150%;
}

.vote-btn-a {
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: var(--accent-light);
}

.vote-btn-a:hover:not(:disabled) {
  background: rgba(56, 189, 248, 0.18);
  border-color: var(--border-glow-blue);
  box-shadow: 0 0 30px rgba(56, 189, 248, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  transform: translateX(-4px) translateY(-2px);
}

.vote-btn-b {
  background: rgba(244, 114, 182, 0.08);
  border: 1px solid rgba(244, 114, 182, 0.25);
  color: var(--accent-pink);
}

.vote-btn-b:hover:not(:disabled) {
  background: rgba(244, 114, 182, 0.18);
  border-color: var(--border-glow-pink);
  box-shadow: 0 0 30px rgba(244, 114, 182, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  transform: translateX(4px) translateY(-2px);
}

.vote-btn-tie {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #34d399;
}

.vote-btn-tie:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.6);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
  transform: translateY(-4px);
}

.vote-btn-neither {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #fbbf24;
}

.vote-btn-neither:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.18);
  border-color: rgba(245, 158, 11, 0.6);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
  transform: translateY(4px);
}
```

---

## 🎭 STEP 8 — Framer Motion Animations

### In `App.jsx`:

Wrap the main content switch with `AnimatePresence` from framer-motion. When switching from landing to battle view and back, use:

```jsx
import { AnimatePresence, motion } from 'framer-motion';

// Wrap landing view:
<motion.div
  key="landing"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
>

// Wrap battle view:
<motion.div
  key="battle"
  initial={{ opacity: 0, scale: 0.97 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 1.02 }}
  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
>
```

### In `BattleView.jsx`:

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Battle columns — staggered entrance:
<motion.div
  className={`battle-column column-a ...`}
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.3 }}
>

<motion.div
  className={`battle-column column-b ...`}
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.2, type: 'spring', bounce: 0.3 }}
>

// Vote buttons — staggered fade up (map with index):
<motion.button
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.08 }}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
>

// Winner banner:
<motion.div
  initial={{ opacity: 0, scale: 0.8, y: -20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
>
```

### In `PromptBox.jsx`:

```jsx
// Hero title — word by word reveal:
// Split "Battle of the Titans" into individual words, wrap each in motion.span:
<motion.span
  key={word}
  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
  transition={{ delay: index * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
>
```

---

## 🎉 STEP 9 — Confetti on Winner Vote

In `BattleView.jsx`, add confetti when a winner is selected:

```jsx
import confetti from 'canvas-confetti';

// Replace onVote calls with this handler:
const handleVote = (model) => {
  if (model.id !== 'tie' && model.id !== 'neither') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#c084fc', '#f472b6', '#ffffff'],
      ticks: 200,
    });
  }
  onVote(model);
};
```

---

## 📜 STEP 10 — Custom Scrollbar (index.css)

Add at the bottom of `index.css`:

```css
/* Custom scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #38bdf8, #c084fc);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover { background: #7dd3fc; }

/* Selection color */
::selection {
  background: rgba(56, 189, 248, 0.3);
  color: #f0f6ff;
}
```

---

## 💬 STEP 11 — Loading State Upgrade (index.css)

Replace the `.shimmer-line` rule with:

```css
.shimmer-line {
  height: 13px;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.10) 40%,
    rgba(56, 189, 248, 0.15) 50%,
    rgba(255,255,255,0.10) 60%,
    rgba(255,255,255,0.04) 100%);
  background-size: 300% 100%;
  animation: shimmer 2s infinite ease-in-out;
  border: 1px solid rgba(255,255,255,0.04);
}

@keyframes shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
```

---

## 🏆 STEP 12 — Winner Banner Upgrade (index.css)

Replace `.winner-banner` with:

```css
.winner-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 18px 28px;
  background: linear-gradient(135deg,
    rgba(56, 189, 248, 0.1),
    rgba(192, 132, 252, 0.1),
    rgba(244, 114, 182, 0.08));
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(192, 132, 252, 0.35);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(192, 132, 252, 0.15), inset 0 1px 0 rgba(255,255,255,0.1);
}

.winner-banner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: var(--gradient-hero);
  opacity: 0.6;
}
```

---

## ✅ FINAL CHECKLIST FOR AGENT

- [ ] All 4 npm packages installed
- [ ] `:root` tokens updated
- [ ] 4th orb + noise overlay + grid overlay added to `App.jsx` and CSS
- [ ] Glass panel upgraded with top highlight line and `::after` shine
- [ ] Hero title has gradient + animated glow (`titleGlow`)
- [ ] Battle columns are glass with hover lift and winner pulse animation
- [ ] All vote buttons have shimmer sweep + colored glow on hover
- [ ] Framer Motion `AnimatePresence` wraps all major view transitions in `App.jsx`
- [ ] Battle columns animate in from left/right on mount
- [ ] Vote buttons stagger in with spring physics
- [ ] Winner banner springs in with bounce
- [ ] Hero words fade + blur in one by one
- [ ] Confetti fires on winner vote (not for tie/neither)
- [ ] Custom scrollbar applied globally
- [ ] Premium shimmer loading lines with blue tint
- [ ] Winner banner has gradient top border line
