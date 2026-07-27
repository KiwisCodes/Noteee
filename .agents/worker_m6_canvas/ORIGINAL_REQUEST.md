## 2026-07-26T16:39:39Z
You are worker_m6_canvas for Noteee.
Your working directory is: /Users/apple/Coding-projects/Noteee/.agents/worker_m6_canvas
Your task is to create the complete specification file: `/Users/apple/Coding-projects/Noteee/16_canvas_pdf_media_workflows.md`.

Context: Noteee is an offline-first, capture-first, AI-powered notebook monorepo built with TypeScript, React Native (Expo SDK 57), and Next.js 15.

Requirements for `16_canvas_pdf_media_workflows.md`:
Enforce strict SOLID, DIP (Dependency Inversion Principle), Clean Architecture, GOF Design Patterns, and Production Pain-Point Analysis ("What pain points lead to this problem and how does our pattern resolve it?") in all sections.

1. GPU Skia Canvas Drawing Engine:
   - 60FPS `@shopify/react-native-skia` pipeline, stroke vector data structure (x, y, pressure, tiltX, tiltY, timestamp), color, width, pen types (pen, pencil, highlighter, marker, eraser).
   - Catmull-Rom spline path smoothing, offscreen double-buffering rendering.
   - `ISkiaCanvasEngine` interface.

2. Spatial Indexing Engine (R-Tree Index):
   - Microsecond spatial queries for stroke collision detection, bounding box selection, lasso tool, scribble-to-erase area erasure.
   - R-Tree envelope intersection math, `IStrokeSpatialIndex` interface.

3. Offline Handwriting Stroke Search Pipeline:
   - Stroke vector to text token mapping, spatial coordinate indexing, SQLite vector & FTS index storage for handwriting search.
   - `IHandwritingRecognizer` interface.

4. Deep PDF Annotation Engine:
   - Text highlighter with glyph quad snapping.
   - Area box capture for embedded charts/tables.
   - Freehand PDF occlusion tape & FSRS image occlusion card generator.
   - Deep link format: `noteee://pdf/{pdfId}?page={pageIndex}&bbox={xMin,yMin,xMax,yMax}`.
   - `IPdfAnnotationEngine` interface.

5. Architecture Diagrams:
   - Include at least 2 complete, 100% valid Mermaid diagrams:
     - Sequence diagram for Skia drawing rendering & stroke handwriting search.
     - State Machine / Flow diagram for PDF annotation & image occlusion flashcard creation.

6. Full TypeScript Interfaces & Code Contracts (Clean Architecture, DIP).

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine and production-ready. DO NOT leave placeholders, TODOs, or incomplete sections. DO NOT break Mermaid diagram syntax (ensure no unescaped special characters or semicolons inside node labels).

When completed, create `progress.md` and `handoff.md` in `/Users/apple/Coding-projects/Noteee/.agents/worker_m6_canvas/` and notify parent via `send_message`.
