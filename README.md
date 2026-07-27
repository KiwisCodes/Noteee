# Noteee — Capture-First, AI-Powered, Offline-First Notebook App

<p align="center">
  <b>Local-First Data Supremacy (0ms Writes) • Notion-Grade Hybrid Block Editor • On-Device AI Embeddings & Whisper STT • 60FPS GPU Skia Canvas • FSRS Spaced Repetition • Zero-Knowledge E2EE Sync</b>
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

### Monorepo Workspaces
- [**`apps/mobile`**](apps/mobile): React Native / Expo SDK 52 application supporting iOS, Android, macOS, and Windows.
- [**`apps/web`**](apps/web): Next.js 15 App Router web client and marketing gateway.
- [**`apps/backend`**](apps/backend): Hono v4 Node.js server handling API routes, PowerSync relay, and WebSocket CRDT streaming.
- [**`packages/core`**](packages/core): Central domain models, block schemas, system anchors, and repository interfaces.
- [**`packages/database`**](packages/database): Drizzle ORM schemas for the 12 local SQLite tables.
- [**`packages/editor`**](packages/editor): TipTap block editor serialization, HTML generator, and React Native WebView bridge protocol handlers.
- [**`packages/intelligence`**](packages/intelligence): On-device ONNX embedding wrappers, Whisper speech-to-text drivers, and cosine similarity vector search.
- [**`packages/sync`**](packages/sync): PowerSync local-first relay client and Yjs CRDT provider handlers.
- [**`packages/ui`**](packages/ui): Cross-platform design system tokens and theme palette.

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

## 🏛️ System Architecture Specifications

Noteee's architecture is thoroughly specified across 18 master architecture documents and 9 UI specification files:

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

### Architecture Specifications Index
1. [`architecture/PROJECT.md`](architecture/PROJECT.md) — Master Architecture Overview & Milestones
2. [`architecture/01_original_feature_list.md`](architecture/01_original_feature_list.md) — Product Vision & Requirement Audit
3. [`architecture/02_system_layers_roadmap.md`](architecture/02_system_layers_roadmap.md) — Monorepo Architecture & Build Strategy
4. [`architecture/03_sector_1_foundation_spec.md`](architecture/03_sector_1_foundation_spec.md) — Sector 1: Foundational Data Hierarchy & Decoupled Architecture
5. [`architecture/04_tech_stack_and_dependencies.md`](architecture/04_tech_stack_and_dependencies.md) — Sector 1 Tech Stack & Package Versions
6. [`architecture/05_sector_2_capture_spec.md`](architecture/05_sector_2_capture_spec.md) — Sector 2: Multi-Modal Ingress & Capture Engine
7. [`architecture/06_sector_3_editor_spec.md`](architecture/06_sector_3_editor_spec.md) — Sector 3: Notion-Grade Block Editor Engine
8. [`architecture/07_sector_4_ai_flashcards_spec.md`](architecture/07_sector_4_ai_flashcards_spec.md) — Sector 4: On-Device AI & FSRS v5 Spaced Repetition Engine
9. [`architecture/08_sector_5_canvas_pdf_spec.md`](architecture/08_sector_5_canvas_pdf_spec.md) — Sector 5: PDF Annotations & GPU Skia Canvas Specification
10. [`architecture/09_sector_6_sync_collab_monetization_spec.md`](architecture/09_sector_6_sync_collab_monetization_spec.md) — Sector 6: Cloud Sync, Auth & Monetization Specification
11. [`architecture/10_component_diagram.md`](architecture/10_component_diagram.md) — Master Monorepo Component Diagram
12. [`architecture/11_class_diagrams.md`](architecture/11_class_diagrams.md) — Core Domain Class Diagrams & Interfaces
13. [`architecture/12_sequence_diagrams.md`](architecture/12_sequence_diagrams.md) — System Sequence Diagrams
14. [`architecture/13_state_machines.md`](architecture/13_state_machines.md) — System Lifecycle State Machines
15. [`architecture/14_agentic_rag_spec.md`](architecture/14_agentic_rag_spec.md) — Sector 7: Multi-Modal Agentic RAG Engine Specification
16. [`architecture/15_cloud_infrastructure_spec.md`](architecture/15_cloud_infrastructure_spec.md) — Sector 8: Cloud Infrastructure, Rate Limiting & Safety Guardrails
17. [`architecture/16_canvas_pdf_media_workflows.md`](architecture/16_canvas_pdf_media_workflows.md) — Canvas & PDF Annotation Media Workflows
18. [`architecture/17_app_shipping_monetization_spec.md`](architecture/17_app_shipping_monetization_spec.md) — App Store Shipping & RevenueCat Monetization Specification

### UI Specifications Index
1. [`ui_specs/01_ui_master_design_system_and_taste_rules.md`](ui_specs/01_ui_master_design_system_and_taste_rules.md)
2. [`ui_specs/02_ui_page_layouts_and_responsive_shells.md`](ui_specs/02_ui_page_layouts_and_responsive_shells.md)
3. [`ui_specs/03_ui_generative_ai_copilot_and_chatbox.md`](ui_specs/03_ui_generative_ai_copilot_and_chatbox.md)
4. [`ui_specs/04_ui_tree_navigation_and_knowledge_graph.md`](ui_specs/04_ui_tree_navigation_and_knowledge_graph.md)
5. [`ui_specs/05_ui_notion_block_editor_and_canvas.md`](ui_specs/05_ui_notion_block_editor_and_canvas.md)
6. [`ui_specs/06_ui_component_inventory_and_states.md`](ui_specs/06_ui_component_inventory_and_states.md)
7. [`ui_specs/07_ui_exhaustive_reusable_component_library.md`](ui_specs/07_ui_exhaustive_reusable_component_library.md)
8. [`ui_specs/08_ui_page_workflows_and_feature_playouts.md`](ui_specs/08_ui_page_workflows_and_feature_playouts.md)
9. [`ui_specs/09_ui_multi_device_responsive_experience_matrix.md`](ui_specs/09_ui_multi_device_responsive_experience_matrix.md)

---

## 🔑 Key Architectural Principles

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
