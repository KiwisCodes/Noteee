# Noteee — Capture-First, AI-Powered, Offline-First Notebook App

<p align="center">
  <b>Local-First Data Supremacy ($0\text{ms}$ Writes) • Notion-Grade Hybrid Block Editor • On-Device AI Embeddings & Whisper STT • 60FPS GPU Skia Canvas • FSRS Spaced Repetition • Zero-Knowledge E2EE Sync</b>
</p>

---

## 📌 Executive Summary

**Noteee** is a cross-platform, capture-first, offline-first notebook application engineered for high-performance personal knowledge management. Built as a **Turborepo + pnpm Modular Monorepo**, Noteee operates seamlessly across mobile (iOS, Android), desktop (macOS, Windows via React Native / Expo SDK 52+), and web (Next.js 15 App Router).

Noteee combines instant local persistence (JSI SQLite via `@op-engineering/op-sqlite` and Drizzle ORM) with local-first cloud streaming (PowerSync relay to Supabase PostgreSQL). On-device Machine Learning (ONNX Runtime `all-MiniLM-L6-v2` embeddings, `whisper.rn` STT, and `ts-fsrs` memory scheduler) guarantees privacy and instant responsiveness without server latency.

---

## 🏗️ Monorepo Package Topology

```plaintext
noteee-monorepo/
├── apps/
│   ├── mobile/           # Expo React Native App (iOS, Android, macOS, Windows)
│   ├── web/              # Next.js 15 App Router (Web Client & Landing)
│   └── backend/          # Node.js Hono v4 API Gateway, PowerSync Relay & WebSockets
└── packages/
    ├── core/             # Domain Entities, Block Schemas, FSRS Engine & Interfaces
    ├── database/         # Drizzle ORM SQLite Schemas & Drivers
    ├── editor/           # TipTap Core Extensions & React Native WebView Bridge
    ├── intelligence/     # Local ONNX Embeddings, Whisper STT & Vector Search Engine
    ├── sync/             # PowerSync Client & Yjs CRDT Provider
    └── ui/               # Cross-Platform Design System & Token Library
```

---

## ⚡ Tech Stack & Verified Versions

| Domain | Technology / Library | Version | Description |
| :--- | :--- | :--- | :--- |
| **Language & Runtime** | TypeScript | `v5.8+` | Strict mode enabled across monorepo |
| **Package Manager** | pnpm | `v11.x` | Workspaces configured with locked subdependencies |
| **Build Engine** | Turborepo | `v2.10.x` | High-speed cached pipeline |
| **Mobile App** | Expo SDK / React Native | SDK 52+ / RN 0.76+ | Cross-platform native application framework |
| **Web Client** | Next.js App Router | `v15.x` | React 19 web interface & server components |
| **Backend Gateway** | Hono | `v4.7.x` | Ultra-fast Node.js server runtime |
| **Local Persistence** | `@op-engineering/op-sqlite` | `v10.1.x` | High-speed C++ JSI bindings to SQLite engine |
| **Type-Safe ORM** | Drizzle ORM | `v0.38.x` | Schema definition & migration engine |
| **Cloud Sync Relay** | PowerSync | `v1.8.x` | Local SQLite-to-Cloud PostgreSQL WebSocket streaming |
| **Cloud Database** | Supabase PostgreSQL | `v2.48.x` | Supabase Auth & `pgvector` cloud store |
| **Rich Text Editor** | TipTap / ProseMirror | `v2.11.x` | Block editor engine + KaTeX math parser |
| **GPU Drawing Engine** | `@shopify/react-native-skia` | `v1.5.x` | 60FPS GPU Skia drawing canvas |
| **On-Device Embeddings** | `onnxruntime-react-native` | `v1.20.x` | `all-MiniLM-L6-v2` 384-dim local embeddings |
| **Speech-to-Text** | `whisper.rn` | `v1.8.x` | Offline C++ `whisper.cpp` voice transcription |
| **Spaced Repetition** | `ts-fsrs` | `v5.0.x` | Free Spaced Repetition Scheduler v5 algorithm |
| **Monetization SDK** | RevenueCat (`react-native-purchases`) | `v8.5.x` | Apple App Store & Google Play IAP billing adapter |

---

## 🏛️ System Architecture Layers & Sectors

Noteee's architecture is divided into 8 decoupled sector specifications:

```
┌────────────────────────────────────────────────────────────────────────┐
│ SECTOR 8: Cloud Infrastructure, Job Queues, Rate Limiting & Safety     │
├────────────────────────────────────────────────────────────────────────┤
│ SECTOR 7: Multi-Modal Agentic RAG Engine (RRF Ranker & Router)        │
├────────────────────────────────────────────────────────────────────────┤
│ SECTOR 6: Cloud Sync, Real-Time Yjs CRDT, Supabase Auth & RevenueCat  │
├────────────────────────────────────────────────────────────────────────┤
│ SECTOR 5: PDF Annotations, 60FPS GPU Skia Canvas & Image Occlusion     │
├────────────────────────────────────────────────────────────────────────┤
│ SECTOR 4: On-Device AI Auto-Filing, Vector DB & FSRS Flashcards        │
├────────────────────────────────────────────────────────────────────────┤
│ SECTOR 3: Notion-Grade Hybrid Block Editor & KaTeX Math Rendering      │
├────────────────────────────────────────────────────────────────────────┤
│ SECTOR 2: Multi-Modal Capture Engine, Local TTS & Session Lifecycle    │
├────────────────────────────────────────────────────────────────────────┤
│ SECTOR 1 (FOUNDATION): Decoupled SQLite DB, 12 Tables & Tree Model    │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Concepts
1. **Root Workspace & Zero-Orphans Rule**: Top-level workspace is represented by `parent_id = NULL`. Notes must reside inside a Folder, Subfolder, or Page container.
2. **7 Universal System Anchors**:
   - `DAILY_JOURNAL`
   - `MISCELLANEOUS`
   - `ENCRYPTED_VAULT`
   - `AUDIO_TRANSCRIPTS`
   - `CAMERA_SCANS`
   - `FLASHCARDS`
   - `CANVAS_DOCUMENTS`
3. **12 Core Block JSON Payload Types**:
   `paragraph`, `heading_1`, `heading_2`, `heading_3`, `todo_item`, `toggle`, `callout`, `code_block`, `latex_math`, `image`, `audio`, `subpage_link` (plus `canvas_embed`, `flashcard_cloze`).
4. **12 Local SQLite Database Tables**:
   `pages`, `blocks`, `tags`, `page_tags`, `anchors`, `vectors`, `capture_sessions`, `canvas_documents`, `canvas_layers`, `canvas_strokes`, `pdf_annotations`, `image_occlusion_masks`.

---

## 🚀 Quickstart & Development

### Prerequisites
- **Node.js**: `v22.x LTS` or `v24.x LTS`
- **Package Manager**: `pnpm v11+` (`npm install -g pnpm`)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Typechecks Across Monorepo
```bash
pnpm typecheck
```

### 3. Build All Workspace Packages
```bash
pnpm build
```

### 4. Start Development Servers
```bash
# Start all apps in parallel (Mobile Expo, Web Next.js, Backend Hono)
pnpm dev

# Or run specific workspace applications:
pnpm --filter @noteee/mobile start
pnpm --filter @noteee/web dev
pnpm --filter @noteee/backend dev
```

---

## 🎨 Design System & Taste Guidelines

Noteee follows strict anti-slop design system rules:
- **Palette**: Deep slate dark mode (`#0F172A`), card surface contrast (`#1E293B`), sleek primary indigo (`#6366F1`), amber/emerald accents.
- **Typography**: Inter / system UI font stack with high legibility scaling.
- **Micro-Interactions**: Smooth 60FPS transitions, tactile haptic feedback, fluid drag-and-drop block ordering (`fractional-indexing`).

---

## 📄 License & Attribution

Copyright © 2026 Noteee Team. All rights reserved.
