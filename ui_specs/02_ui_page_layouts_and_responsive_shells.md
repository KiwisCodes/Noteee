# UI Spec 02: Page Layouts & Responsive Multi-Device Shells

## 1. Top-Level Page Routing Architecture

The Noteee application features 5 primary top-level routes and workspace views:

```
/app
├── /workspace          # Main 3-column unified editor & tree workspace
├── /ai-copilot         # Immersive Generative AI Chatbox & Launchpad
├── /flashcards         # FSRS Spaced-Repetition Study Center
├── /canvas             # GPU Infinite Canvas & PDF Annotation Studio
└── /settings           # Theme Manager, AI Providers, Sync Status & Keys
```

---

## 2. Desktop & Laptop Layout Shell (1280px+)

On large desktop displays (MacBook Pro, iMac, external monitors), Noteee presents a 3-pane glass grid:

```
+-----------------------------------------------------------------------------------+
| Top Navigation Bar: [Vault Selector] [Breadcrumbs] [Search Cmd+K] [Theme Switcher] |
+------------------+----------------------------------------+-----------------------+
| Knowledge Tree   | Notion-Grade Block Editor / Canvas      | AI Copilot Inspector  |
| Sidebar          | Workspace                              | Drawer                |
|                  |                                        |                       |
| - Nested Folders | - Cover & Icon                         | - Generative Widgets  |
| - Pages          | - Editable Blocks                      | - RAG Citations       |
| - Pinned Notes   | - Floating Toolbar                     | - Topic Blueprints    |
| - Trash          |                                        |                       |
+------------------+----------------------------------------+-----------------------+
| Bottom Status Bar: [Sync Pill: Saved 2m ago] [AI Status: Idle] [Theme: Dracula Dark] |
+-----------------------------------------------------------------------------------+
```

- **Sidebar Width**: 260px fixed (collapsible to 0px with hover trigger).
- **Editor Width**: Dynamic flex (`min-width: 600px`, centered max-width 880px).
- **AI Inspector Width**: 340px fixed (collapsible drawer toggle).

---

## 3. Tablet & iPad Layout Shell (768px - 1024px)

For iPad Pro / Air viewports:
- **Default View**: Dual-Pane view (Sidebar + Editor).
- **AI Inspector**: Slide-over glass sheet triggered by tapping top-right AI orb.
- **Touch Targets**: Enlarged drag handles (44px minimum touch targets), touch gesture support for tree indentation.

---

## 4. Mobile Phone Layout Shell (375px - 430px)

For iPhone / Android phones:
- **Single-Column Focus Layout**: Editor or Active Page takes 100% viewport width.
- **iOS Bottom Navigation Bar**: Floating glass bar with 4 tabs: `[Tree] [Editor] [AI Chat] [Search]`.
- **iOS Bottom Sheets**: Tree navigation and AI Copilot launch as smooth pull-up glass sheets with swipe-down dismissal.
