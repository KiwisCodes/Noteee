# UI Spec 01: Master Design System & @taste Rules

## 1. Aesthetic Vision & Core Philosophy

Noteee is designed as a luxury, Apple-inspired, Notion-grade note-taking experience. It combines Notion's block-based productivity structure with Apple's premium glassmorphism aesthetic and Awwwards-level motion polish.

### @taste Configuration Dials
- **`DESIGN_VARIANCE: 8`**: Restrained asymmetry with organic 24px/16px rounded glass surfaces.
- **`MOTION_INTENSITY: 7`**: Fluid spring physics (Apple HIG feel) for panel reveals, card flips, and micro-interactions.
- **`VISUAL_DENSITY: 3`**: Generous white space, breathable typography, and uncluttered focus areas.

---

## 2. Color Palettes & Theme Engine

The application supports 5 distinct theme modes, dynamically managed via CSS custom properties and `dark:` variant classes:

### Mode 1: Dracula Dark (Primary High-Contrast Dark)
- **Background Base**: `#282a36` (Gothic Deep Charcoal)
- **Glass Overlay Panels**: `rgba(40, 42, 54, 0.75)` with `backdrop-filter: blur(20px)`
- **Accent Pink**: `#ff79c6` (Primary Action / Active Handles)
- **Accent Purple**: `#bd93f9` (AI Glows & Selection Highlights)
- **Accent Cyan**: `#8be9fd` (Interactive Links & Status Indicators)
- **Accent Emerald**: `#50fa7b` (Success & Sync Completion)
- **Text Primary**: `#f8f8f2` (Crisp High-Contrast Text)
- **Border / Divider**: `rgba(98, 114, 164, 0.3)`

### Mode 2: Nordic Minimal Light (Primary High-Contrast Light)
- **Background Base**: `#eceff4` (Polar Snow White)
- **Glass Overlay Panels**: `rgba(236, 239, 244, 0.8)` with `backdrop-filter: blur(20px)`
- **Text Primary**: `#2e3440` (Deep Frost Slate)
- **Accent Blue**: `#88c0d0` (Primary Action & Active Selection)
- **Accent Frost**: `#5e81ac` (Focus & Navigation Pills)
- **Border / Divider**: `rgba(216, 222, 233, 0.6)`

### Mode 3: Apple Midnight (Dark Alternative)
- **Background Base**: `#0a0a0c` (Pure Obsidian Black)
- **Glass Panels**: `rgba(18, 18, 22, 0.65)` with `backdrop-filter: blur(24px)`
- **Ambient Halos**: Subtle purple/blue radial gradients (`radial-gradient(circle, rgba(120, 119, 198, 0.15), transparent 70%)`)
- **Text Primary**: `#ffffff`

### Mode 4: Solarized Dark
- **Background Base**: `#002b36` (Deep Solarized Teal)
- **Accent Yellow/Cyan**: `#b58900` / `#2aa198`

### Mode 5: Solarized Light
- **Background Base**: `#fdf6e3` (Warm Solarized Cream)
- **Accent Slate/Blue**: `#657b83` / `#268bd2`

---

## 3. Glassmorphism & Elevation System

- **Glass Surface Level 1 (Background Workspace)**: Solid theme base color.
- **Glass Surface Level 2 (Panels & Sidebar)**: 70% opacity theme background with `backdrop-filter: blur(20px) saturate(180%)`. Border: `1px solid rgba(255, 255, 255, 0.08)`.
- **Glass Surface Level 3 (Floating Modals & Chatbox)**: 85% opacity theme background with `backdrop-filter: blur(32px)`. Box shadow: `0 20px 40px rgba(0, 0, 0, 0.3)`. Radius: `24px`.

---

## 4. Typography Hierarchy

- **Font Family (Sans-Serif)**: `SF Pro Display`, `Inter`, system sans-serif.
- **Font Family (Monospace)**: `Geist Mono`, `SF Mono`, `JetBrains Mono`.
- **Title (H1)**: `32px / 1.2`, Weight 700, tracking `-0.02em`.
- **Heading (H2)**: `24px / 1.3`, Weight 650, tracking `-0.01em`.
- **Heading (H3)**: `18px / 1.4`, Weight 600.
- **Body Regular**: `15px / 1.6`, Weight 400.
- **Caption / Meta**: `13px / 1.4`, Weight 500, muted opacity `0.7`.
