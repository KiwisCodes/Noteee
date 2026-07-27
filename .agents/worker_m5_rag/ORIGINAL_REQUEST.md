## 2026-07-26T23:37:14Z

<USER_REQUEST>
You are worker_m5_rag for Noteee.
Your working directory is: /Users/apple/Coding-projects/Noteee/.agents/worker_m5_rag
Your task is to create the complete specification file: `/Users/apple/Coding-projects/Noteee/14_agentic_rag_spec.md`.

Context: Noteee is an offline-first, capture-first, AI-powered notebook monorepo built with TypeScript, React Native (Expo SDK 57), and Next.js 15.

Requirements for `14_agentic_rag_spec.md`:
Enforce strict SOLID, DIP (Dependency Inversion Principle), Clean Architecture, GOF Design Patterns, and Production Pain-Point Analysis ("What pain points lead to this problem and how does our pattern resolve it?") in all sections.

1. Decoupled Architecture (IRagEngine DIP Interface):
   - Local RAG (Mobile/Native): On-device ONNX `all-MiniLM-L6-v2` embeddings + SQLite vector tables + BM25 sparse index.
   - Cloud RAG (Web/Server): Server-side `pgvector` embedding index + Cross-Encoder re-ranking.
   - Strategy/Factory pattern for IRagEngine (`ILocalRagEngine` and `ICloudRagEngine`).

2. Multi-Modal Chunking Pipeline:
   - PDF Chunks: Bounding box spatial coordinates (pageIndex, xMin, yMin, xMax, yMax), extracted text, section headers.
   - Image OCR Chunks: Spatial region bounding boxes, recognized text, visual element labels.
   - Audio Chunks: Whisper timestamped segment windows (startMs, endMs, text, speakerId).
   - Canvas Chunks: Recognized handwriting stroke bounding boxes (R-Tree spatial index).
   - Block Chunks: TipTap block JSON payloads (paragraph, math, code, flashcard, etc.).
   - Full TypeScript interface contracts: IChunker, MultiModalChunk, PdfChunk, ImageOcrChunk, AudioChunk, CanvasChunk, BlockChunk.

3. Hybrid Retrieval Strategy:
   - Reciprocal Rank Fusion (RRF) combining dense vector embeddings + sparse BM25 keyword search.
   - Mathematical formula: RRF(d) = \sum_{m \in M} 1 / (k + r_m(d)) with k = 60.
   - Rank normalization, fallback handles for empty matches, weight scoring.

4. Agentic RAG Control Loop:
   - Query Classifier & Router (Text vs Vision vs Audio query intent).
   - Context Retrieval & RRF Fusion.
   - Cross-Encoder Re-ranker.
   - Hallucination / Factuality Reflection & Self-Correction step.
   - Context Synthesis & Attribution Citation.
   - Include at least 2 complete, 100% valid Mermaid diagrams:
     - Sequence diagram for Agentic RAG Query Execution & Reflection/Self-Correction.
     - Flow/State diagram for Agentic Control Loop Routing.

5. On-Device vs Cloud Implementation Details.

6. Full TypeScript Interfaces & Code Contracts (Clean Architecture, DIP).

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine and production-ready. DO NOT leave placeholders, TODOs, or incomplete sections. DO NOT break Mermaid diagram syntax (ensure no unescaped special characters or semicolons inside node labels).

When completed, create `progress.md` and `handoff.md` in `/Users/apple/Coding-projects/Noteee/.agents/worker_m5_rag/` and notify parent via `send_message`.
</USER_REQUEST>
