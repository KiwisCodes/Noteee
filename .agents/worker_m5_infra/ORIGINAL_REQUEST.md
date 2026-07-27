## 2026-07-26T16:37:14Z

<USER_REQUEST>
You are worker_m5_infra for Noteee.
Your working directory is: /Users/apple/Coding-projects/Noteee/.agents/worker_m5_infra
Your task is to create the complete specification file: `/Users/apple/Coding-projects/Noteee/15_cloud_infrastructure_spec.md`.

Context: Noteee is an offline-first, capture-first, AI-powered notebook monorepo built with TypeScript, React Native (Expo SDK 57), and Next.js 15.

Requirements for `15_cloud_infrastructure_spec.md`:
Enforce strict SOLID, DIP (Dependency Inversion Principle), Clean Architecture, GOF Design Patterns, and Production Pain-Point Analysis ("What pain points lead to this problem and how does our pattern resolve it?") in all sections.

1. High-Availability Cloud Topology:
   - Load Balancers (AWS ALB / NGINX / Cloudflare), Node.js WebSocket Relay clusters (for Yjs CRDT real-time sync), Redis Cluster (session state, rate limit tokens, hot vector query cache, pub/sub state).
   - Multi-AZ deployment, failover strategies, scalability.

2. Job Queues vs Message Queues Analysis:
   - Job Queues (BullMQ + Redis): When and why used in Noteee (bulk PDF OCR, batch Whisper audio transcription, server-side vector embedding generation, heavy PDF/zip exports).
   - Message Queues (RabbitMQ / Apache Kafka): Evaluation of when pub/sub message brokers are needed (multi-region event streaming, telemetry data pipelines, audit logs) vs lightweight BullMQ.
   - Production Pain Point Analysis: Resource exhaustion on mobile/web during heavy background processing -> Solution: Asynchronous distributed job queue processing with exponential backoff & retry.

3. Tiered Rate Limiting Engine:
   - Token Bucket / Leaky Bucket algorithms per user tier (Free, Pro, Pay-As-You-Go AI Credits, BYOK API keys).
   - Mathematical formulas, Redis Lua atomic script architecture for thread-safe rate limiting.
   - `IRateLimiter` interface contracts and TypeScript schemas.

4. Multi-Agent Safety Guardrails & Moderation:
   - Content Moderation (text/vision), PII scrubbing (regex + NER for email, phone, SSN, credit cards), Prompt Injection Defense (canary tokens, input sanitization, delimiter isolation), Output Sanitization (XSS prevention).
   - Chain of Responsibility pattern for `ISafetyGuardrail` and `GuardrailPipeline`.

5. Architecture Diagrams:
   - Include at least 2 complete, 100% valid Mermaid diagrams:
     - Component/Topology diagram for Cloud Infrastructure & Load Balancers.
     - Sequence/State diagram for Job Queue Processing (BullMQ) and Safety Guardrail Chain.

6. Full TypeScript Interfaces & Code Contracts (Clean Architecture, DIP).

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine and production-ready. DO NOT leave placeholders, TODOs, or incomplete sections. DO NOT break Mermaid diagram syntax (ensure no unescaped special characters or semicolons inside node labels).

When completed, create `progress.md` and `handoff.md` in `/Users/apple/Coding-projects/Noteee/.agents/worker_m5_infra/` and notify parent via `send_message`.
</USER_REQUEST>
