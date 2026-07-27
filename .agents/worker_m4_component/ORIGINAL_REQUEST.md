## 2026-07-26T10:39:31Z
<USER_REQUEST>
You are a specialist Worker agent assigned to Milestone 4.
Your working directory is `/Users/apple/Coding-projects/Noteee/.agents/worker_m4_component/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

YOUR TASK:
Create the complete architectural component diagram file: `/Users/apple/Coding-projects/Noteee/10_component_diagram.md`.

REQUIREMENTS:
1. Provide a comprehensive software component architecture specification for Noteee.
2. Include at least one primary system-wide Mermaid diagram (`graph TB` or `flowchart TB`) showing:
   - Monorepo Apps: `apps/mobile` (React Native / Expo SDK 57 for iOS, Android, macOS), `apps/web` (Next.js 15 App Router), `apps/backend` (Hono API / Node.js server).
   - Monorepo Packages (`packages/*`): `packages/db` (Drizzle SQLite, 12 tables: pages, blocks, tags, page_tags, anchors, vectors, capture_sessions, canvas_documents, canvas_layers, canvas_strokes, pdf_annotations, image_occlusion_masks), `packages/editor` (Notion-grade editor, 12 block JSON types, Yjs binding), `packages/ai` (ONNX Runtime, all-MiniLM-L6-v2 vector embeddings, Whisper STT, FSRS scheduler), `packages/canvas` (Infinite canvas engine, Skia rendering, PDF annotation layer), `packages/sync` (PowerSync client, Yjs provider, WebSocket client), `packages/shared` (Shared schemas, types, validation), `packages/ui` (Design system & UI components).
   - Package dependency relations with arrow directions.
   - External Service Connections: PostgreSQL (Supabase), PowerSync Relay Server, WebSocket Server, Supabase Auth Service, RevenueCat Billing API, External AI API fallback (OpenAI/Claude), Cloud Storage (S3/Cloudflare R2).
3. Provide detailed sub-diagrams and technical breakdowns for:
   - Client Monorepo Package Topology & Boundaries
   - Backend Micro-services / Serverless Architecture & Database Connectors
   - Offline-First Data Pipeline (Local SQLite <-> PowerSync Client <-> PowerSync Relay <-> Postgres)
   - Real-Time Yjs WebSocket Collaboration Topology
4. Ensure 100% cross-file consistency with `01_original_feature_list.md` through `09_sector_6_sync_collab_monetization_spec.md`.
5. Ensure valid standard Mermaid syntax in all diagram blocks. Do NOT use unescaped semicolons or invalid syntax characters inside Mermaid node text or lines.
6. Write the completed deliverable directly to `/Users/apple/Coding-projects/Noteee/10_component_diagram.md` using `write_to_file`.

When completed, output a summary and call `send_message` back to parent orchestrator.
</USER_REQUEST>
