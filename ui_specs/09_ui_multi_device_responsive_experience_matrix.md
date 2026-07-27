# UI Spec 09: Multi-Device Responsive Experience & Viewport Matrix

## 1. Multi-Device Layout Matrix Overview

Noteee provides an adaptive experience tailored specifically for 4 primary device forms: **Laptop/Desktop Web**, **Tablets (iPad/Android)**, **Mobile Phones (iOS/Android)**, and **Web PWA Standalone Mode**.

---

## 2. Laptop & Desktop Experience (1280px - 2560px+)

### Layout Structure
- **3-Pane Glass Command Center**:
  - Pane 1 (Left): `TreeSidebar` (260px fixed width, hover collapse toggle).
  - Pane 2 (Center): Main Editor / Canvas Workspace (Flex fill, max-width 880px for readable typography).
  - Pane 3 (Right): `CopilotChatDrawer` (340px fixed width, slide-in glass panel).
- **Keyboard Ergonomics**: Full `Cmd+K` Spotlight command palette, `/` slash menu, `Cmd+\` sidebar toggle, `Cmd+J` AI Copilot toggle.
- **Mouse & Pointer Interactions**: Hover handles, custom glass drag indicators, right-click context menus.

---

## 3. Tablet Experience (768px - 1024px, iPad Pro / Air / Mini)

### Layout Structure
- **Dual-Pane Split View**:
  - Default view displays `TreeSidebar` + Editor Workspace side-by-side.
  - Tapping editor expands view to full-screen editor; sidebar slides out left.
- **AI Copilot Integration**: Slides in as an overlay glass drawer from right with tap-outside dismissal.
- **Touch & Apple Pencil Ergonomics**:
  - Minimum touch targets set to 44px x 44px.
  - Infinite Canvas supports Apple Pencil pressure sensitivity and palm rejection.
  - Floating toolbar positionable along top or bottom screen edge.

---

## 4. Mobile Phone Experience (375px - 430px, iPhone 15/16 Pro, Galaxy S24)

### Layout Structure
- **Single-Column Focus Layout**:
  - The viewport dedicates 100% width to the active screen (Editor, Tree, AI Chat, or Study Mode).
- **iOS Bottom Glass Navigation Bar**:
  - Sticky floating bar at screen bottom: `[📁 Tree] [📝 Editor] [💬 AI Chat] [🔍 Search]`.
  - Active tab highlighted with glowing glass indicator.
- **iOS Bottom Sheets**:
  - Tree navigation and AI Copilot launch as pull-up glass bottom sheets with swipe-down drag gesture handles.
- **Mobile Ergonomics**:
  - All primary action buttons (New Note, AI Voice Record) placed in thumb-reach zone (lower third of screen).
  - Haptic feedback triggers on block reordering and flashcard swipes.

---

## 5. Web Version & PWA Nuances

- **Browser Responsive Breakpoints**:
  - `sm`: 640px (Mobile phone layout).
  - `md`: 768px (Tablet dual-pane transition).
  - `lg`: 1024px (Desktop split view).
  - `xl`: 1280px (Full 3-pane command center).
- **Safari iOS Address Bar Adjustments**: Uses `svh` / `dvh` dynamic viewport height units to prevent address bar overlap.
- **PWA Offline Mode**: Service Worker caches glass assets and local SQLite database for uninterrupted offline editing.
