# Project: Noteee Software Architecture & Design Planning

## Architecture Overview
- **Product Vision**: Capture-First, AI-Powered Offline-First Cross-Platform Notebook App
- **Core Principles**: Local-First Data Supremacy ($0\text{ms}$ local writes), Zero-Friction Multi-Modal Ingress ($\le 1.5\text{s}$ launch to record), Notion-Grade Hybrid Block Editing, 60FPS GPU Skia Canvas, On-Device AI & Flashcards (FSRS v5.0.x), Multi-Modal Agentic RAG, Zero-Knowledge E2EE Collaboration, and High-Availability Cloud Infrastructure.
- **Tech Stack**:
  - **Client Applications**: TypeScript, React Native (Expo SDK 57), Next.js 15 App Router.
  - **Backend API & Cloud**: Hono v4 API Gateway (Node.js 24 LTS), Cloudflare Enterprise Edge (CDN/WAF), AWS Application Load Balancer (ALB).
  - **Persistence & Sync**: Local JSI SQLite (`@op-engineering/op-sqlite` via Drizzle ORM), PowerSync Relay, Supabase Auth & PostgreSQL (`pgvector`), Redis Cluster (DB 0-3), BullMQ Job Worker Cluster, Node.js Yjs WS Relay Cluster.
  - **On-Device Machine Learning**: ONNX Runtime (`all-MiniLM-L6-v2` 384-dim embeddings), C++ `whisper.cpp` via `whisper.rn`, `ts-fsrs` (v5.0.x).
  - **GPU Canvas & Media**: `@shopify/react-native-skia`, Spatial R-Tree Indexing Engine, `pdfjs-dist` quad snapping, image occlusion active recall masks.
  - **Monetization & Security**: RevenueCat billing SDK (`react-native-purchases`), hardware enclave encrypted BYOK KeyManager, AdMob fallback banners.
- **System Layers**:
  - **Layer 1**: Sector 1 (Foundation - tree hierarchy, 7 universal anchors, date-time engine, 12 SQLite schema tables, PowerSync, vector DB).
  - **Layer 2**: Sector 2 (Multi-Modal Capture Engine - voice, video, camera OCR, web snip, text ingress).
  - **Layer 3**: Sector 3 (Notion-Grade Block Editor - 12 block JSON types, TipTap extension bridge, Yjs CRDT binding).
  - **Layer 4**: Sector 4 (On-Device AI & FSRS Flashcards - local ONNX MiniLM embedder, Whisper voice STT, FSRS v5.0.x scheduler).
  - **Layer 5**: Sector 5 (PDF Annotations & Infinite Canvas - GPU Skia renderer, Spatial R-Tree index, quad snapping, occlusion masks).
  - **Layer 6**: Sector 6 (Cloud Sync, Collaboration, TTS, Auth & Revenue - PowerSync, Yjs WS relay, Supabase Auth, RevenueCat, BYOK).
  - **Layer 7**: Sector 7 (Multi-Modal Agentic RAG Engine - hybrid Reciprocal Rank Fusion, local ONNX + cloud pgvector router, reflective self-correction loop).
  - **Layer 8**: Sector 8 (Cloud Infrastructure, Job Queues, Tiered Rate Limiting & Safety Guardrails - Cloudflare, AWS ALB, Redis Cluster DB 0-3, BullMQ workers, PII/Injection/XSS safety chain).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | R1 Gaps Fix | Fix files 01-04 (Accessibility, 05_ numbering, capture_sessions, parentPageId, 12 block JSONs, TTS/Auth layers, 12 stack deps) | none | DONE |
| 2 | R2 Sectors 2-4 | Create 05_sector_2_capture_spec.md, 06_sector_3_editor_spec.md, 07_sector_4_ai_flashcards_spec.md | M1 | DONE |
| 3 | R2 Sectors 5-6 | Create 08_sector_5_canvas_pdf_spec.md, 09_sector_6_sync_collab_monetization_spec.md | M1 | DONE |
| 4 | R3 Diagrams & Audit | Create 10_component_diagram.md, 11_class_diagrams.md, 12_sequence_diagrams.md, 13_state_machines.md, verify consistency | M2, M3 | DONE |
| 5 | R4 Sector 7 RAG & Cloud Infra | Create 14_agentic_rag_spec.md, 15_cloud_infrastructure_spec.md | M4 | DONE |
| 6 | R4 Canvas PDF & Shipping | Create 16_canvas_pdf_media_workflows.md, 17_app_shipping_monetization_spec.md | M5 | DONE |
| 7 | R5 Master Diagrams & Deliverable Sync | Master architectural diagrams update (10-13) and final PROJECT.md sync | M6 | DONE |

## Deliverable Files Map
1. `01_original_feature_list.md` (Done)
2. `02_system_layers_roadmap.md` (Done)
3. `03_sector_1_foundation_spec.md` (Done)
4. `04_tech_stack_and_dependencies.md` (Done)
5. `05_sector_2_capture_spec.md` (Done)
6. `06_sector_3_editor_spec.md` (Done)
7. `07_sector_4_ai_flashcards_spec.md` (Done)
8. `08_sector_5_canvas_pdf_spec.md` (Done)
9. `09_sector_6_sync_collab_monetization_spec.md` (Done)
10. `10_component_diagram.md` (Done)
11. `11_class_diagrams.md` (Done)
12. `12_sequence_diagrams.md` (Done)
13. `13_state_machines.md` (Done)
14. `14_agentic_rag_spec.md` (Done)
15. `15_cloud_infrastructure_spec.md` (Done)
16. `16_canvas_pdf_media_workflows.md` (Done)
17. `17_app_shipping_monetization_spec.md` (Done)

## Interface Contracts & Shared Standards
- **12 Core Block JSON Types**: `paragraph`, `heading_1`, `heading_2`, `heading_3`, `todo_item`, `toggle`, `callout`, `code_block`, `latex_math`, `image`, `audio`, `subpage_link` (plus `canvas_embed`, `flashcard_cloze`).
- **12 Local SQLite Database Tables**: `pages`, `blocks`, `tags`, `page_tags`, `anchors`, `vectors`, `capture_sessions`, `canvas_documents`, `canvas_layers`, `canvas_strokes`, `pdf_annotations`, `image_occlusion_masks`.
- **Core Monorepo Domain Interfaces**:
  - `IRagEngine`: Decoupled multi-modal agentic RAG controller (ONNX, pgvector, hybrid RRF ranker $k=60$).
  - `IStrokeSpatialIndex`: $O(\log N)$ R-Tree spatial index for GPU canvas strokes and lasso queries.
  - `IJobQueueAdapter`: BullMQ asynchronous job queue manager over Redis Cluster DB 2.
  - `IRateLimiter`: Tiered token bucket and sliding window rate limiter backed by Redis DB 0 Lua scripts.
  - `IPdfAnnotationEngine`: Bounding quad snapping and FSRS image occlusion mask engine.
  - `IBillingAdapter`: Unified monetization boundary wrapping RevenueCat, BYOK KeyManager, and AdMob.
  - `ISafetyGuardrail`: Input safety pipeline executing PII scrubbing, prompt injection canary detection, and XSS sanitization.
  - `IEmbedder`, `ISpeechToText`, `ITextRecognizer`, `IFSRSScheduler`, `INoteRepository`, `IFolderRepository`, `ITagRepository`, `ICaptureSource`.
- **AI & Spaced Repetition**: ONNX Runtime (`all-MiniLM-L6-v2` 384-dim vectors), `whisper.rn` JSI voice STT, FSRS v5.0.x memory decay algorithm ($R \ge 0.90$).
- **Diagram Syntax**: 100% valid Mermaid syntax (`mermaid ... `) in all master architectural specification files.
