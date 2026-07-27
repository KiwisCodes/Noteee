# Original User Request

## Initial Request — 2026-07-26T10:24:13Z

# Teamwork Project Prompt — Noteee Architecture Planning

Complete the full software architecture and design planning phase for the Noteee application — a capture-first, AI-powered notebook app built with TypeScript, React Native (Expo SDK 57), and Next.js 15. All planning documents, diagrams, and specifications must be finalized before any source code is written. This is a **planning-only** task: produce markdown specification files and Mermaid diagrams. Do NOT write any application source code.

Working directory: /Users/apple/Coding-projects/Noteee
Integrity mode: development

## Context & Existing Files

The project directory already contains 4 planning files from prior work. Read all of them carefully before starting:

- `01_original_feature_list.md` — Complete feature list (MVP/v2/v3+), non-functional requirements
- `02_system_layers_roadmap.md` — 6-layer build roadmap with sequence diagrams per layer
- `03_sector_1_foundation_spec.md` — Sector 1 specification: tree hierarchy, 7 universal anchors, date-time engine, Drizzle SQLite schema, decoupled cloud sync, vector DB
- `04_tech_stack_and_dependencies.md` — Verified July 2026 dependency versions and technology stack

## Requirements

### R1. Fix identified gaps in the 4 existing files

Apply the following corrections to the existing files. Do NOT rewrite them from scratch — make targeted edits preserving all existing content.

**File 1 (`01_original_feature_list.md`):**
- Add back the missing Accessibility & Localization section from the original spec (VoiceOver/TalkBack, Dynamic Type, English + Vietnamese dual-language support, Vietnamese-tuned AI models)
- Consider bumping "Session Continuation" from `[v2]` to `[MVP]` since the capture session flow depends on it

**File 2 (`02_system_layers_roadmap.md`):**
- Fix deliverable file numbering: sector spec files should start at `05_` since `04_` is now the tech stack file (Layer 2 → `05_sector_2_capture_spec.md`, Layer 3 → `06_sector_3_editor_spec.md`, Layer 4 → `07_sector_4_ai_flashcards_spec.md`, Layer 5 → `08_sector_5_canvas_pdf_spec.md`, Layer 6 → `09_sector_6_sync_collab_monetization_spec.md`)
- Clarify where TTS belongs in the layer stack (it's an MVP feature but is currently buried in Layer 6)
- Add Authentication to the layer stack (required for multi-device sync)

**File 3 (`03_sector_1_foundation_spec.md`):**
- Add a `capture_sessions` table to the Drizzle schema for persisting in-progress capture sessions across app kills
- Add `parentPageId` column to the `pages` table to support Page-in-Page nesting (like Notion)
- Define the JSON `content` payload shape for ALL 12 block types (paragraph, heading_1/2/3, todo_item, toggle, callout, code_block, latex_math, image, audio, subpage_link, canvas_embed, flashcard_cloze)
- Clarify how Daily Notes works at the query level: is it a virtual computed view or a physical table?

**File 4 (`04_tech_stack_and_dependencies.md`):**
- Do NOT change any existing version numbers (they are verified correct for July 2026)
- ADD the following missing dependencies: `expo-speech` (TTS), `react-native-worklets` (required by Reanimated v4), `uuid` or `expo-crypto` (UUID generation), `date-fns` or `dayjs` (date utilities), `fractional-indexing` (block ordering), `zod` (runtime schema validation), `expo-notifications` (local push notifications for To-Do alerts), `expo-haptics` (micro-interactions), `expo-file-system` (PDF/audio file management), `expo-clipboard` (clipboard detection), `@supabase/supabase-js` (authentication), `react-native-google-mobile-ads` (ad SDK)

### R2. Create 5 new sector specification files (Sectors 2–6)

Create detailed specification files for each remaining system layer. Each file must include:
- Feature breakdown with user interaction flows
- Relevant design patterns with rationale
- Data models / schema additions specific to that sector
- Sequence diagrams (Mermaid) showing key flows
- State machine diagrams where applicable (e.g., capture session lifecycle, flashcard review states)
- Interface/contract definitions (TypeScript-style, medium detail: key interfaces and important methods, not every getter/setter)

**`05_sector_2_capture_spec.md`** — Multi-Modal Capture Engine:
- Camera multi-photo scanning, Whisper offline STT, Quick Capture bar, Clipboard detection
- Background session persistence (iOS Live Activities / Dynamic Island)
- Session state machine: IDLE → RECORDING → PROCESSING → SUGGESTION → FILED
- ICaptureSource strategy pattern interface

**`06_sector_3_editor_spec.md`** — Notion-Grade Block Editor:
- TipTap WebView Bridge architecture (mobile) + native TipTap (web)
- All 12 block type renderers and their behaviors
- Slash command menu (/) system
- Undo/redo command history
- Real-time collaboration readiness (Yjs document structure)

**`07_sector_4_ai_flashcards_spec.md`** — On-Device AI & FSRS Flashcards:
- Local embedding pipeline (all-MiniLM-L6-v2 ONNX)
- 3 AI placement pathways (fallback, existing suggestion, new branch creation)
- Unified semantic search architecture
- FSRS spaced repetition algorithm integration
- Cloze deletion and Q&A card generation flow
- Flashcard review session state machine

**`08_sector_5_canvas_pdf_spec.md`** — PDF Annotations & Infinite Canvas:
- Skia GPU drawing pipeline
- PDF reader, text/area highlighter, freehand drawing
- Image occlusion card generation
- Canvas block embedding and coordinate system
- Stroke data model

**`09_sector_6_sync_collab_monetization_spec.md`** — Cloud Sync, Collaboration & Revenue:
- PowerSync local-first sync pipeline (SQLite ↔ PostgreSQL)
- Yjs CRDT real-time collaboration
- Zero-knowledge E2EE link sharing (hash-fragment key model)
- TTS audio playback engine
- Authentication flow (Supabase Auth)
- RevenueCat billing integration (free trial, ads, lifetime unlock, Pro subscription)

### R3. Create architectural diagram files

Create dedicated diagram files using Mermaid notation covering the full system:

**`10_component_diagram.md`** — High-level system component diagram showing:
- Monorepo package boundaries (apps/mobile, apps/web, apps/backend, packages/*)
- Dependencies between packages
- External service connections (PostgreSQL, PowerSync relay, WebSocket server)

**`11_class_diagrams.md`** — Key interface and class relationship diagrams:
- Repository interfaces (INoteRepository, IFolderRepository, ITagRepository)
- AI service interfaces (IEmbedder, ISpeechToText, ITextRecognizer, IClassificationEngine)
- Capture source strategy (ICaptureSource and implementations)
- Block type hierarchy
- FSRS scheduler contracts
- Billing provider adapter

**`12_sequence_diagrams.md`** — End-to-end user flow sequence diagrams:
- First-launch onboarding (AI chat → template selection → tree customization)
- Full capture session lifecycle (activate → capture media → confirm → AI suggest → file)
- Note editing and auto-save flow
- Semantic search query execution
- Flashcard study session (draw card → answer → FSRS reschedule)
- Multi-device sync conflict resolution
- Collaboration link sharing and joining

**`13_state_machines.md`** — State machine diagrams:
- Capture session states
- Flashcard review card states (New → Learning → Review → Relearning)
- Vault lock/unlock states
- Sync connection states (Offline → Syncing → Online → Conflict)

## Acceptance Criteria

### Existing files are updated correctly
- [ ] File 1 contains the Accessibility & Localization section
- [ ] File 2 deliverable references use correct file numbers starting at 05_
- [ ] File 3 Drizzle schema includes `capture_sessions` table and `parentPageId` on pages
- [ ] File 3 defines JSON content shapes for all 12 block types
- [ ] File 4 lists all 12 additional dependencies without changing existing version numbers

### New sector specification files are complete
- [ ] Files 05_ through 09_ each exist and contain: feature descriptions, design patterns, schema additions, at least 2 Mermaid sequence/state diagrams, and TypeScript interface definitions
- [ ] Each sector file's content is consistent with the decisions in Files 01-04 (same tech stack, same architecture patterns, same database engine)

### Architectural diagram files are complete
- [ ] Files 10_ through 13_ each exist and contain valid Mermaid diagram syntax
- [ ] Component diagram shows all monorepo packages and their dependency arrows
- [ ] Class diagrams cover at minimum: repository interfaces, AI service interfaces, capture strategy, and block type hierarchy
- [ ] Sequence diagrams cover at minimum: onboarding, capture session, note editing, search, flashcard review, and multi-device sync
- [ ] State machines cover at minimum: capture session, flashcard card states, vault lock, and sync connection

### Cross-file consistency
- [ ] No contradictions between files (e.g., block types listed in File 3 match those in File 06_, interface names in File 11_ match those referenced in sector specs)
- [ ] All file cross-references use correct file numbers

## 2026-07-26T16:36:33Z

# Teamwork Project Prompt — Expanded Production Architecture, RAG, Infrastructure & Shipping Specs

Complete the expanded software architecture, distributed systems engineering, multi-modal Agentic RAG, infinite canvas / PDF annotation workflows, and app store shipping specifications for Noteee — an offline-first, capture-first, AI-powered notebook monorepo built with TypeScript, React Native (Expo SDK 57), and Next.js 15.

This is a **planning-only** task: produce detailed markdown specification files and Mermaid diagrams. Do NOT write any application source code.

Working directory: /Users/apple/Coding-projects/Noteee
Integrity mode: development

## Comprehensive Scope & Architectural Guidelines

Every specification must enforce strict SOLID principles, Dependency Inversion Principle (DIP), Clean Architecture, GOF Design Patterns, and production pain-point analysis ("What pain points lead to this problem and how does our pattern resolve it?").

### R1. Multi-Modal Agentic RAG Architecture (`14_agentic_rag_spec.md`)
- **Decoupled Architecture (`IRagEngine` DIP Interface):**
  - Mobile / Native App (Local RAG): On-device ONNX `all-MiniLM-L6-v2` embeddings + SQLite vector tables + BM25 sparse index.
  - Cloud / Web App (Cloud RAG): Server-side `pgvector` embedding index + Cross-Encoder re-ranking.
- **Multi-Modal Chunking Pipeline:**
  - PDF Chunks: Bounding box spatial coordinates, page index, and extracted text.
  - Image OCR Chunks: Spatial region bounding boxes, recognized text, and visual element labels.
  - Audio Chunks: Whisper timestamped segment windows (start/end ms).
  - Canvas Chunks: Recognized handwriting stroke bounding boxes (R-Tree spatial index).
  - Block Chunks: TipTap block JSON payloads.
- **Hybrid Retrieval Strategy:** Reciprocal Rank Fusion (RRF) combining dense vector embeddings + sparse BM25 keyword search.
- **Agentic RAG Control Loop:**
  - Query Classifier & Router (Text vs Vision vs Audio query intent).
  - Context Retrieval & RRF Fusion.
  - Cross-Encoder Re-ranker.
  - Hallucination / Factuality Reflection & Self-Correction step.
  - Context Synthesis & Attribution Citation.

### R2. Production Cloud Infrastructure, Distributed Systems & Queues (`15_cloud_infrastructure_spec.md`)
- **High-Availability Topology:** Load Balancers (AWS ALB / NGINX / Cloudflare), Node.js WebSocket Relay clusters, Redis Cluster (session state, rate limit tokens, hot vector query cache).
- **Job Queues vs Message Queues Analysis:**
  - **Job Queues (BullMQ + Redis):** When and why used in Noteee (async heavy processing: bulk PDF OCR, batch Whisper audio transcription, server-side vector embedding generation).
  - **Message Queues (RabbitMQ / Apache Kafka):** Evaluation of when pub/sub message brokers are needed (multi-region event streaming, telemetry data pipelines) vs lightweight BullMQ.
  - **Pain Points:** Resource exhaustion on mobile/web during heavy background processing → Solution: Asynchronous distributed job queue processing.
- **Rate Limiting Engine:** Token Bucket / Leaky Bucket algorithms per user tier (Free, Pro, Pay-As-You-Go AI Credits, BYOK API keys).
- **Multi-Agent Safety Guardrails:** Content moderation, PII scrubbing, prompt injection defense, and output sanitization.

### R3. Infinite Canvas, PDF Annotations & Media Workflows (`16_canvas_pdf_media_workflows.md`)
- **GPU Skia Canvas Drawing Engine:** 60FPS `@shopify/react-native-skia` pipeline, stroke vector data structure (points, pressure, tilt, color, width).
- **Spatial Indexing (R-Tree Index):** Microsecond spatial queries for stroke collision detection, bounding box selection, and area erasure (scribble-to-erase gesture).
- **Handwriting Stroke Search Pipeline:** Offline handwriting OCR mapping stroke vectors to text tokens with spatial coordinates.
- **Deep PDF Annotation Engine:**
  - Text highlighter with snap-to-word boundary snapping.
  - Area box capture for embedded charts/tables.
  - Freehand PDF occlusion tape & image occlusion card generator for FSRS flashcards.
  - Deep links linking annotations directly back to PDF page & bounding box coordinates.

### R4. App Shipping, Monetization & Lifecycle (`17_app_shipping_monetization_spec.md`)
- **App Store (iOS) & Google Play Store Submission:** Guidelines, metadata, native iOS/Android permissions manifests, and in-app rating review triggers.
- **Monetization Engine (RevenueCat):** 90-day free trial, ad-supported free tier (AdMob banner constraints), lifetime unlock, Pro subscription, BYOK API key manager, Pay-As-You-Go credit packs.
- **Analytics & Observability:** Telemetry, Sentry error monitoring, crash reporting, and A/B testing strategy.

### R5. Master Diagram Update (`10_component_diagram.md`, `11_class_diagrams.md`, `12_sequence_diagrams.md`, `13_state_machines.md`)
- Update component diagram to include Redis, BullMQ, Cloudflare/ALB, and RAG Engine packages.
- Add class diagrams for `IRagEngine`, `IStrokeSpatialIndex`, `IJobQueueAdapter`, `IRateLimiter`, and `IPdfAnnotationEngine`.
- Add sequence diagrams for Multi-Modal Agentic RAG query execution and Canvas stroke handwriting search.

## Acceptance Criteria

### Files 14_ through 17_ are created and comprehensive
- [ ] `14_agentic_rag_spec.md` details chunking schemas, RRF hybrid search, and Agentic RAG control loop with Mermaid sequence diagrams.
- [ ] `15_cloud_infrastructure_spec.md` details Load Balancers, Redis caching, BullMQ vs Message Queues analysis, rate limiting math, and multi-agent safety guardrails.
- [ ] `16_canvas_pdf_media_workflows.md` details Skia GPU stroke data model, R-Tree spatial indexing, stroke search, and PDF deep annotations.
- [ ] `17_app_shipping_monetization_spec.md` details App Store / Play Store compliance, RevenueCat billing, BYOK security, and analytics.

### Diagrams 10_ through 13_ are updated
- [ ] All 4 diagram files include the new RAG, Infrastructure, Canvas, and Billing components with 100% valid Mermaid syntax.

