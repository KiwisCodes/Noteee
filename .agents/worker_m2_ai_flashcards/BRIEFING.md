# BRIEFING — 2026-07-26T17:27:00+07:00

## Mission
Create `07_sector_4_ai_flashcards_spec.md` for Sector 4 (On-Device AI & FSRS Flashcards) with complete architecture, sequence diagrams, state machine, mathematical formulas, and TypeScript interfaces, strictly aligned with files 01..04.

## 🔒 My Identity
- Archetype: Worker (implementer, qa, specialist)
- Roles: implementer, qa, specialist
- Working directory: /Users/apple/Coding-projects/Noteee/.agents/worker_m2_ai_flashcards
- Original parent: e1f0760e-96e0-4f58-aa6d-a6e9d5449033
- Milestone: M2 - Sector Specs (Sector 4)

## 🔒 Key Constraints
- Pure local execution, no cloud reliance for default operations.
- Full consistency with `01_original_feature_list.md`, `02_system_layers_roadmap.md`, `03_sector_1_foundation_spec.md`, and `04_tech_stack_and_dependencies.md`.
- ONNX model: `all-MiniLM-L6-v2` via `onnxruntime-react-native` (CoreML / NNAPI execution providers, 384-dimensional float32 embeddings).
- Hybrid search using Reciprocal Rank Fusion (RRF) combining cosine vector similarity + BM25 keyword search.
- 3 AI placement pathways (Default fallback, Cosine similarity auto-suggest to existing folder, New branch hierarchy creation).
- FSRS v5.0.x integration (`ts-fsrs`), standard rating scale (Again=1, Hard=2, Good=3, Easy=4), stability/difficulty/retention decay calculations ($R(t) = (1 + F \cdot t / S)^{-1}$).
- Cloze deletion & Q&A flashcard generation from block editor content.
- Flashcard review session state machine (`New` -> `Learning` -> `Review` -> `Relearning`).
- TypeScript interfaces: `IEmbedder`, `IClassificationEngine`, `ISemanticSearchEngine`, `IFSRSScheduler`, `IFlashcardGenerator`.

## Current Parent
- Conversation ID: e1f0760e-96e0-4f58-aa6d-a6e9d5449033
- Updated: 2026-07-26T17:27:00+07:00

## Task Summary
- **What to build**: `07_sector_4_ai_flashcards_spec.md`
- **Success criteria**: Comprehensive, fully detailed technical specification document adhering strictly to requirements 1-8 in the prompt and consistent with specs 01..04.
- **Interface contracts**: `01_original_feature_list.md`, `02_system_layers_roadmap.md`, `03_sector_1_foundation_spec.md`, `04_tech_stack_and_dependencies.md`, `PROJECT.md`.

## Key Decisions Made
- Include full mathematical formulas for FSRS v5.0 decay and memory updating.
- Provide explicit TypeScript contracts with exact types, docstrings, and error bounds.
- Include 5 Mermaid diagrams: state machine + 4 sequence diagrams (embedding pipeline, semantic search, AI auto-filing, flashcard study review).

## Change Tracker
- **Files modified**: `07_sector_4_ai_flashcards_spec.md` (to be created), `progress.md`, `handoff.md`.
- **Build status**: N/A (specification phase).
- **Pending issues**: None.

## Quality Status
- **Build/test result**: N/A
- **Lint status**: Markdown linting compliant.
- **Tests added/modified**: N/A

## Loaded Skills
- None.

## Artifact Index
- `/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md` — Sector 4 specification document.
