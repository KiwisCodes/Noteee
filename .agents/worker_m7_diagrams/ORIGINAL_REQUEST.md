## 2026-07-26T16:43:41Z
You are worker_m7_diagrams for Noteee.
Your working directory is: /Users/apple/Coding-projects/Noteee/.agents/worker_m7_diagrams.

Your task is to update the 4 master architectural diagram files and `PROJECT.md` at root:
1. `/Users/apple/Coding-projects/Noteee/10_component_diagram.md`
2. `/Users/apple/Coding-projects/Noteee/11_class_diagrams.md`
3. `/Users/apple/Coding-projects/Noteee/12_sequence_diagrams.md`
4. `/Users/apple/Coding-projects/Noteee/13_state_machines.md`
5. `/Users/apple/Coding-projects/Noteee/PROJECT.md`

Requirements for diagram updates (R5):
- `10_component_diagram.md`: Add Cloudflare/AWS ALB load balancers, Redis Cluster DB 0-3, BullMQ job queue & worker cluster, Node.js WebSocket relay cluster for Yjs, `@noteee/rag-engine`, `@noteee/skia-canvas`, `@noteee/monetization` packages and dependencies.
- `11_class_diagrams.md`: Add class diagrams for `IRagEngine` (Local ONNX + Cloud pgvector + RRF + Chunker), `IStrokeSpatialIndex` (R-Tree), `IJobQueueAdapter` (BullMQ), `IRateLimiter` (Token Bucket / Sliding Window / Lua script), `IPdfAnnotationEngine` (quad snapping, FSRS occlusion), `IBillingAdapter` (RevenueCat, BYOK KeyManager, AdMob), and `ISafetyGuardrail` (PII scrubber, prompt injection canary, XSS sanitizer).
- `12_sequence_diagrams.md`: Add sequence diagrams for (1) Multi-Modal Agentic RAG query execution & self-reflection loop, (2) Canvas stroke drawing rendering & stroke handwriting search pipeline, (3) BullMQ async job execution with safety guardrail chain, and (4) RevenueCat subscription purchase with BYOK key fallback.
- `13_state_machines.md`: Add state machines for (1) Agentic RAG query control loop state machine, (2) User Subscription Lifecycle & Entitlements state machine, (3) BullMQ job lifecycle state machine, and (4) PDF Annotation / FSRS Occlusion Card state machine.
- `PROJECT.md`: Update deliverable map to include all 17 files (Files 01 through 17), update Milestones table (Milestones 1-7 all completed), update architecture overview and interface contracts.

MANDATORY SYNTAX & INTEGRITY CONSTRAINTS:
- 100% valid Mermaid syntax in all 4 diagram files.
- NO unescaped special characters or semicolons inside node brackets or labels.
- Ensure all code blocks are properly opened and closed (```mermaid ... ```).
- Maintain all existing diagram content in files 10-13, adding the new components cleanly.

When completed, create `progress.md` and `handoff.md` in your working directory and notify parent via `send_message`.
