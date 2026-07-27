# Milestone 2 (Sector Specs 05–07) Comprehensive Review & Audit Report

**Date**: 2026-07-26  
**Reviewer**: Reviewer / Critic Subagent (`reviewer_m2_1`)  
**Scope**: 
- `/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md`
- `/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md`
- `/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md`
- Cross-file consistency with `01_original_feature_list.md`, `02_system_layers_roadmap.md`, `03_sector_1_foundation_spec.md`, `04_tech_stack_and_dependencies.md`, and `PROJECT.md`.

---

## Executive Summary & Final Verdict

**Verdict**: **APPROVE**  
*Recommendation*: All three sector specification files (`05_sector_2_capture_spec.md`, `06_sector_3_editor_spec.md`, `07_sector_4_ai_flashcards_spec.md`) are exceptionally thorough, mathematically grounded, architecturally sound, and fully aligned with foundational specs 01–04 and `PROJECT.md`. One minor mathematical constant clarification in File 07 (FSRS decay factor $F$) is noted below for precision.

---

## 1. File 05 Audit: Sector 2 Multi-Modal Capture Engine & Session Lifecycle

### Verification Requirements & Results

| Feature / Requirement | Spec Location | Verified Details & Assessment | Status |
| :--- | :--- | :--- | :---: |
| **Camera Multi-Photo Scanning** | Section 2.1 | Single & batch multi-photo modes using `expo-camera` with custom Skia edge quad overlay, auto-crop, contrast/binarization post-processing, draggable thumbnail carousel (`order_index`, rotation, retake), disk caching to `Directory.Cache/capture_sessions/{sessionId}/photo_{index}.jpg`. | **PASS** |
| **Whisper Offline STT** | Section 2.2 | `whisper.rn` binding `whisper.cpp` via JSI, 16kHz 16-bit mono WAV, `whisper-tiny.en` (39MB) / `whisper-base.en` (74MB), 2s sliding window with 500ms real-time UI partial emissions, VAD silence suppression, live transcript preview card. | **PASS** |
| **Quick Capture** | Section 2.3 | Floating bar (mobile) & Global Hotkey (`Cmd+Shift+K` on macOS, `Ctrl+Shift+K` on Win/Linux), $<300\text{ms}$ cold launch, inline markdown parser, modality switcher (photo/mic/text), 1-tap save to SQLite. | **PASS** |
| **Clipboard Detection** | Section 2.4 | `AppState` foreground listener, `expo-clipboard`, heuristic classifiers (URL, Credentials/Keys -> Vault 🔒, Text/Code -> Daily notes, Image), SHA-256 deduplication table in SQLite, explicit user prompt before persisting. | **PASS** |
| **Local Text-to-Speech (TTS)** | Section 2.5 | `expo-speech` native OS engine (`AVSpeechSynthesizer` / `TextToSpeech`), background audio (`AVAudioSessionCategoryPlayback`), speed controls ($0.5\times$–$2.0\times$), sentence boundary events (`OnBoundary`) for UI scroll/highlighting. | **PASS** |
| **Live Activities / Dynamic Island** | Section 3.1 & 3.2 | Swift Native Module (`LiveActivityModule.swift`) bridging React Native JSI to iOS ActivityKit (`ILiveActivityBridge`), Dynamic Island UI state matrix for `RECORDING` (audio/photo), `PROCESSING`, and `SUGGESTION`. | **PASS** |
| **Background Persistence & Crash Recovery** | Section 3.3 | Atomic SQLite buffer flushes to `capture_sessions` with WAL mode (`journal_mode=WAL`), cold launch orphan session scanner for `RECORDING`/`PROCESSING` states restoring disk media & prompt. | **PASS** |
| **Session State Machine Diagram** | Section 4 | Mermaid state diagram defining `IDLE` $\rightarrow$ `RECORDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SUGGESTION` $\rightarrow$ `FILED` / `CANCELLED` with full transition matrix. | **PASS** |
| **Design Patterns & Rationale** | Section 5 | Strategy Pattern (`ICaptureSource`), Builder Pattern (`CaptureSessionBuilder`), Observer Pattern (`CaptureEventSubject` & `ICaptureObserver`). | **PASS** |
| **Data Models & Drizzle Schemas** | Section 6 | Schema matches Layer 1 `capture_sessions` and introduces `capture_chunks` buffer table with cascade deletion (`references(() => captureSessions.id, { onDelete: 'cascade' })`). Typed JSON payload discriminated unions for 7 modalities (`PhotoSessionData`, `MultiPhotoSessionData`, `AudioSessionData`, `TextSessionData`, `ClipboardSessionData`, `ScreenSessionData`, `MultiModalSessionData`). | **PASS** |
| **Sequence Diagrams** | Section 7 | Mermaid sequence diagrams for (1) Camera Multi-Photo Scan & AI Placement, (2) Offline Whisper Audio Recording & Transcription, (3) Quick Capture Bar & Clipboard Auto-Detection. | **PASS** |
| **TypeScript Interface Definitions** | Section 8 | Production-grade interfaces: `CaptureModality`, `CaptureSessionState`, `ICaptureSource`, `ICaptureSessionManager`, `ISuggestionEngine`, `ILiveActivityBridge`, `IWhisperEngine`, `IClipboardDetector`, `ITextToSpeechEngine`, `ICaptureEventObserver`. | **PASS** |

---

## 2. File 06 Audit: Sector 3 Notion-Grade Block Editor Engine

### Verification Requirements & Results

| Feature / Requirement | Spec Location | Verified Details & Assessment | Status |
| :--- | :--- | :--- | :---: |
| **TipTap WebView Bridge** | Sections 1 & 2 | Dual-runtime architecture: RN Expo SDK 57 uses `react-native-webview` with `@tiptap/core` & ProseMirror over microsecond bi-directional RPC bridge (`postMessage`/JSI); Next.js 15 SSR/CSR uses `@tiptap/react` natively in React DOM tree. `RPCMessage` schema and 8 RPC methods specified with cold init, crash recovery, and `pendingRPCQueue`. | **PASS** |
| **All 12 Block Renderers & Behaviors** | Section 3 | Complete schemas, ProseMirror renders, and interactive keyboard/gesture behaviors for all 12 block types: (1) `paragraph`, (2) `heading_1/2/3` (with folding chevrons), (3) `todo_item` (linked to To-Do Anchor query), (4) `toggle` (indented container), (5) `callout` (theme switcher & emoji popover), (6) `code_block` (lowlight syntax highlighting & copy code button), (7) `latex_math` (KaTeX render & live preview edit popover), (8) `image` (resizable handles & offline disk cache), (9) `audio` (waveform player & Whisper transcript drawer), (10) `subpage_link` (router push & title auto-sync), (11) `canvas_embed` (GPU Skia canvas thumbnail preview & full-screen edit), (12) `flashcard_cloze` (cloze deletion syntax & FSRS sync). | **PASS** |
| **Slash Command System** | Section 4 | Trigger rules (`/` at empty block start or after whitespace), dismissal rules, popover positioning math, weighted fuzzy search formula $\text{Score} = (0.5 \cdot S_{\text{title}}) + (0.3 \cdot S_{\text{alias}}) + (0.2 \cdot S_{\text{cat}})$, physical keyboard navigation (`ArrowUp/Down`, `Tab`, `Enter`) & mobile keyboard accessory bar. Complete registry table of 14 commands across 5 categories. | **PASS** |
| **Transaction Undo/Redo History** | Section 5 | `ICommandHistoryManager` pipeline, ProseMirror step extraction, atomic SQLite persistence, **500ms sliding debounced typing aggregation** for text entry, discrete action force-closing, selection state preservation (`EditorSelectionState`), and **CRDT local history isolation** (`isRemote: true` bypasses undo stack). | **PASS** |
| **Yjs CRDT Model** | Section 6 | `yjs`, `Y.Doc`, `prosemirror` `Y.XmlFragment`, `y-prosemirror` binding integration code block, Yjs Awareness protocol (`YjsAwarenessState`: client ID, user badge/color, cursor coordinates), offline-first local state merging via `Y.encodeStateVector`. | **PASS** |
| **Sequence Diagrams** | Section 7 | Mermaid sequence diagrams for (1) Mobile WebView RPC Bridge Communication Flow, (2) Block Transaction Auto-Save & Undo/Redo Execution Flow. | **PASS** |
| **TypeScript Interface Definitions** | Section 8 | Interfaces: `BlockType`, `TextSpan`, 12 Block Content Payloads, `BlockRecord`, `BlockRendererProps`, `IBlockRenderer`, `RPCMessage`, `ITipTapBridge`, `SlashCommandItem`, `ISlashCommandRegistry`, `EditorSelectionState`, `TransactionStep`, `ICommandHistoryManager`, `YjsAwarenessState`, `IYjsSyncProvider`. | **PASS** |

---

## 3. File 07 Audit: Sector 4 On-Device AI, Vector DB, Search & Flashcards (FSRS)

### Verification Requirements & Results

| Feature / Requirement | Spec Location | Verified Details & Assessment | Status |
| :--- | :--- | :--- | :---: |
| **Local ONNX Embedding Pipeline** | Section 2 | `all-MiniLM-L6-v2` ONNX INT8 model (~22.9MB), 384-dim Float32 vector embeddings, 256 token limit, `onnxruntime-react-native` v1.20.x executing via CoreML (iOS) and NNAPI (Android). `BertTokenizer` pre-processing, Mean pooling, L2 normalization $\|v\|_2 = 1.0$. Micro-batching ($B=4$), 500-item LRU cache, vector tables schema (`folderVectors`, `pageVectors`, `blockVectors`). | **PASS** |
| **3 AI Placement Pathways** | Section 3 | Cosine similarity $S(u, v_k) = u \cdot v_k$. Pathway 1 (Fallback -> `Miscellaneous`), Pathway 2 (Existing Suggestion -> Top 2–3 folders/pages for $S \ge 0.60$), Pathway 3 (New Branch Creation -> Prompt subfolder for $0.40 \le S < 0.60$). Folder centroid exponential moving average update $v_{k,\text{new}} = \text{L2Norm}(\alpha v_{k,\text{old}} + (1-\alpha) u)$ with $\alpha = 0.85$. | **PASS** |
| **Hybrid Semantic Search** | Section 4 | Dense Vector + Sparse SQLite FTS5 BM25 ($k_1=1.2, b=0.75$) merged via **Reciprocal Rank Fusion (RRF)**: $RRF(d) = \sum \frac{1}{60 + r_m(d)}$. `page_fts` virtual table schema, sequence diagram, sub-500ms SLA plan across 10,000 notes. | **PASS** |
| **FSRS v5.0.x Spaced Repetition** | Section 5 | Retention decay $R(t, S) = (1 + F \cdot t/S)^{-1}$, interval $I(R_{\text{target}}, S) = \frac{S}{F} (R_{\text{target}}^{-1} - 1)$, 4 rating scale (Again=1, Hard=2, Good=3, Easy=4), initial $S_0(r) / D_0(r)$ equations, difficulty update $D_{\text{reverted}}$, recall stability $S_{\text{new}}$, lapse stability $S_{\text{new\_forget}}$. Drizzle schema for `flashcards` & `flashcardReviewLogs`. | **PASS (with note)** |
| **Cloze & Q&A Card Generation** | Section 6 | `Cmd+Shift+C` shortcut, syntax `{{c1::answer::hint}}`, regex `/\{\{c(\d+)::([^:]+)(?:::([^}]+))?\}\}/g`, on-device AI Q&A card generator flow with staging queue UI (Accept, Edit, Reject). | **PASS** |
| **Review Session State Machine** | Section 7 | 4 states: `New`, `Learning`, `Review`, `Relearning`. Mermaid state diagram, full state transition matrix, sequence diagram for study session loop. | **PASS** |
| **TypeScript Interface Definitions** | Section 8 | Interfaces: `EmbeddingResult`, `TokenizerOutput`, `IEmbedder`, `FolderSuggestion`, `NewBranchSuggestion`, `PlacementPathway`, `IClassificationEngine`, `SearchQueryOptions`, `SearchResultItem`, `ISemanticSearchEngine`, `FSRSRating`, `FlashcardState`, `FSRSCard`, `FSRSReviewLog`, `FSRSSchedulingInfo`, `FSRSNextSchedules`, `IFSRSScheduler`, `ClozeDeletion`, `GeneratedQACard`, `IFlashcardGenerator`. | **PASS** |

---

### Minor Mathematical Finding in File 07

**Finding 1 (Minor Formula Constant Precision)**:
- **Location**: `07_sector_4_ai_flashcards_spec.md`, Section 5.2 (lines 266, 271, 275).
- **Observation**:
  - Line 266 states: *"where $F = \frac{9}{19} \approx 0.47368$ is the FSRS decay constant such that when $t = S$, retention exactly equals $90\%$ ($R = 0.90$)."*
  - Line 275 states: *"For $R_{\text{target}} = 0.90$: $I(0.90, S) = S$"*.
- **Adversarial Mathematical Proof**:
  - In Section 5.2 line 263, the retention formula is $R(t, S) = \left( 1 + F \cdot \frac{t}{S} \right)^{-1}$.
  - Evaluating at $t = S$: $R(S, S) = \frac{1}{1 + F}$.
  - If $F = \frac{9}{19}$: $R(S, S) = \frac{1}{1 + 9/19} = \frac{1}{28/19} = \frac{19}{28} \approx 0.67857$ (or $67.86\%$), **not** $0.90$.
  - For $R(S, S) = 0.90 = \frac{9}{10}$, we solve $\frac{1}{1 + F} = \frac{9}{10} \implies 1 + F = \frac{10}{9} \implies F = \frac{1}{9} \approx 0.111111$.
  - Plugging $F = \frac{1}{9}$ into interval formula $I(0.90, S) = \frac{S}{F} (1/0.90 - 1) = \frac{S}{1/9} (\frac{1}{9}) = S$, which perfectly matches line 275 ($I(0.90, S) = S$).
- **Impact**: Low runtime risk since `ts-fsrs` package calculates intervals internally, but fixing $F = \frac{1}{9} \approx 0.111111$ in the text ensures internal mathematical rigor.

---

## 4. Cross-File Consistency Audit (Files 01..04 vs 05..07)

1. **Tech Stack Parity**:
   - `Expo SDK 57` (React Native 0.86) verified across 04, 05, 06.
   - `@op-engineering/op-sqlite` v10.3.x verified across 03, 04, 05, 06, 07.
   - `drizzle-orm` v0.38.x verified across 03, 04, 05, 06, 07.
   - `whisper.rn` v1.8.x (`whisper.cpp`) verified across 04, 05, 06.
   - `@tiptap/core` / `@tiptap/react` v2.11.x verified across 04, 06.
   - `onnxruntime-react-native` v1.20.x + `all-MiniLM-L6-v2` 384-dim verified across 03, 04, 07.
   - `ts-fsrs` v5.0.x verified across 04, 06, 07.

2. **The 7 Universal System Anchors**:
   - Daily Notes (📅), To-Do & Planner (✅), Miscellaneous (📥), Ideas (💡), Vault (🔒), Inbox (🔔), Flashcards Hub (🃏) are consistently integrated across 03, 05, 06, and 07.

3. **3 AI Placement Pathways**:
   - Fallback Default (`Miscellaneous`), AI Existing Suggestion ($S \ge 0.60$), and New Branch Creation ($0.40 \le S < 0.60$) match 100% between File 03 (Section 1) and File 07 (Section 3).

4. **Drizzle SQLite Table Consistency**:
   - `folders`, `pages`, `capture_sessions`, `capture_chunks`, `blocks`, `folder_vectors`, `page_vectors`, `block_vectors`, `tags`, `page_tags`, `flashcards`, `flashcard_review_logs` are schema-compatible.

5. **Block Type Schemas Alignment**:
   - File 06 standardizes the 12 core block type renderers (`paragraph`, `heading_1`, `heading_2`, `heading_3`, `todo_item`, `toggle`, `callout`, `code_block`, `latex_math`, `image`, `audio`, `subpage_link`, `canvas_embed`, `flashcard_cloze`) matching `PROJECT.md`. Draft interface hints from File 03/05 smoothly consolidate into File 06's production block payload union.

---

## 5. Adversarial Challenge & Stress-Testing Report

### Stress Test 1: High-Frequency RPC Traffic during Rapid Typing
- **Scenario**: User types at 120 WPM inside mobile WebView while fast slash commands execute.
- **Evaluation**: The 500ms sliding debounced typing window in `ICommandHistoryManager` aggregates text keypresses into a single history step. Structural node mutations force-close the debouncing window, preventing RPC message backlog and preventing UI jank.

### Stress Test 2: Background Audio Recording & Memory Pressure
- **Scenario**: iOS system triggers low memory warning while Whisper STT processes audio during active multi-photo camera acquisition.
- **Evaluation**: `CaptureSessionManager` flushes chunks immediately to SQLite WAL (`capture_chunks`) and disk cache (`/Directory.Cache/capture_sessions/{id}/`). Cold launch orphan recovery inspects `RECORDING`/`PROCESSING` states, guaranteeing zero user data loss on background OS process kill.

### Stress Test 3: Multi-User CRDT Sync Replay vs Local Undo Stack
- **Scenario**: Local user presses `Cmd+Z` while remote collaborators push concurrent edits via Yjs WebSocket stream.
- **Evaluation**: Remote transactions are tagged `{ isRemote: true }` and update ProseMirror + SQLite directly without touching `undoStack`. Pressing `Cmd+Z` reverts only local user mutations, preserving CRDT document convergence.

---

## Conclusion

Milestone 2 sector specifications 05, 06, and 07 are **approved**. They meet all technical, architectural, and verification requirements.
