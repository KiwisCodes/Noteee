# Milestone 1 (R1 Gap Fixes): Comprehensive Requirements Analysis & Exact Change Specification

## Executive Summary

This report provides the definitive analysis and exact change specifications for Milestone 1 (R1 Gap Fixes) across Noteee's four core planning documents:
1. `01_original_feature_list.md`
2. `02_system_layers_roadmap.md`
3. `03_sector_1_foundation_spec.md`
4. `04_tech_stack_and_dependencies.md`

All findings, schema extensions, sequence definitions, and dependency selections have been audited for strict architectural consistency, zero-orphan tree invariants, offline-first local-first principles, and cross-platform (React Native + Next.js) compatibility.

---

## 1. Change Specification for `01_original_feature_list.md`

### 1.1 Gap Analysis
1. **Session Continuation Priority**: Session continuation was categorized under `[v2]` despite being a core requirement of the background multi-modal capture session workflow. In an offline-first capture notebook, users frequently append additional photos, voice snippets, or quick text into an active capture session before confirming auto-filing.
2. **Missing Accessibility & Localization Section**: `01_original_feature_list.md` lacked explicit non-functional and functional requirements for accessibility (Dynamic Type, screen readers, high contrast, keyboard navigation) and localization (RTL support, multi-language i18n catalogs).

### 1.2 Exact Change Specifications

#### Change 1.2.1: Bump Session Continuation to [MVP]
- **Target File**: `01_original_feature_list.md`
- **Location**: Line 20 (under `### Capture & Input`)
- **Original Content**:
```markdown
- **[v2] Session Continuation:** Allows users to append photos, audio files, or text into a recently active capture session instead of forcing a new session creation.
```
- **Replacement Content**:
```markdown
- **[MVP] Session Continuation:** Allows users to append photos, audio files, or text into a recently active capture session instead of forcing a new session creation.
```

#### Change 1.2.2: Add Accessibility & Localization Section
- **Target File**: `01_original_feature_list.md`
- **Location**: Insert after `### Account Management & Monetization` section (before `---` and `## Non-Functional Requirements`).
- **Content to Add**:
```markdown

### Accessibility & Localization
- **[MVP] Dynamic Type & Scalable Text:** Full compliance with OS-level text scaling (iOS Dynamic Type and Android Font Scaling) across all note renderers, tree views, menus, and editor blocks.
- **[MVP] Screen Reader Accessibility:** Comprehensive accessibility labels, roles, and hints for VoiceOver (iOS/macOS) and TalkBack (Android) to ensure total voice navigation across tree structures, capture modals, and flashcards.
- **[MVP] Right-to-Left (RTL) Layout Support:** Native text direction support for RTL languages (Arabic, Hebrew, Persian) across rich text editor blocks, folder trees, and navigation panels.
- **[MVP] Multi-Language i18n Core Framework:** Built-in internationalization infrastructure (`react-i18next`) with full English (US) string catalogs and locale-aware date/time formatting.
- **[v2] Expanded Regional Localizations:** Support for localized UI catalogs in Spanish, French, German, Japanese, Simplified Chinese, and Korean.
- **[v2] Accessible High-Contrast Themes:** Specialized dark/light high-contrast visual themes meeting WCAG 2.1 AA contrast ratios ($\ge 4.5:1$ for body text).
- **[v2] Full Keyboard Navigation & Focus Rings:** Explicit keyboard shortcut tab indexing and focus indicators across desktop wrappers and web interfaces.
- **[v3+] Speech & TTS Multi-Lingual Auto-Switching:** Automatic language detection for offline speech-to-text (Whisper) and speech synthesis (TTS) across multi-lingual user notes.
```

---

## 2. Change Specification for `02_system_layers_roadmap.md`

### 2.1 Gap Analysis
1. **Deliverable File Numbering Collision**: Layer 2's deliverable file was assigned `04_sector_2_capture_spec.md`. However, file `04_tech_stack_and_dependencies.md` already exists in the project root! All subsequent sector deliverable filenames (`05_`, `06_`, `07_`, `08_`) were off by one.
2. **Text-to-Speech (TTS) Scope Clarification**: Core TTS (Local Note Audio Playback, Audio Control Panel, Background Audio Playback) is an MVP requirement. In `02_system_layers_roadmap.md`, TTS was mentioned under Layer 6 without clarifying that local offline playback belongs in Layer 2 (Media Engine).
3. **Authentication Layer Integration**: Authentication (local biometrics for Vault + cloud identity/OAuth for multi-device sync) was absent from the 6-layer stack hierarchy description.

### 2.2 Exact Change Specifications

#### Change 2.2.1: Update Deliverable File Numbers (Starting at 05_)
- **Target File**: `02_system_layers_roadmap.md`
- **Updates Required**:
  - Layer 2 Deliverable File: Change `04_sector_2_capture_spec.md` to `05_sector_2_capture_spec.md`.
  - Layer 3 Deliverable File: Change `05_sector_3_editor_spec.md` to `06_sector_3_editor_spec.md`.
  - Layer 4 Deliverable File: Change `06_sector_4_ai_flashcards_spec.md` to `07_sector_4_ai_flashcards_spec.md`.
  - Layer 5 Deliverable File: Change `07_sector_5_canvas_pdf_spec.md` to `08_sector_5_canvas_pdf_spec.md`.
  - Layer 6 Deliverable File: Change `08_sector_6_sync_collaboration_monetization_spec.md` to `09_sector_6_sync_collaboration_monetization_spec.md`.

#### Change 2.2.2: Add Authentication & Clarify TTS Placement in Layer Architecture
- **Target File**: `02_system_layers_roadmap.md`
- **Updated Section 1 Architecture Diagram**:
```
  ┌────────────────────────────────────────────────────────────────────────┐
  │ LAYER 6 (ROOF): Cloud Sync, CRDT, Cloud Auth & Monetization           │
  ├────────────────────────────────────────────────────────────────────────┤
  │ LAYER 5: PDF Annotations, Skia Drawing Canvas & Image Occlusion        │
  ├────────────────────────────────────────────────────────────────────────┤
  │ LAYER 4: On-Device AI Auto-Filing, Vector DB & FSRS Flashcards          │
  ├────────────────────────────────────────────────────────────────────────┤
  │ LAYER 3: Notion-Grade Hybrid Block Editor & KaTeX Math Rendering        │
  ├────────────────────────────────────────────────────────────────────────┤
  │ LAYER 2: Multi-Modal Capture Engine, Local TTS & Session Lifecycle      │
  ├────────────────────────────────────────────────────────────────────────┤
  │ LAYER 1 (FOUNDATION): Decoupled DB, Local Auth/Vault, Tree & Anchors  │
  └────────────────────────────────────────────────────────────────────────┘
```
- **Layer Details Updates**:
  - **Layer 1 Details**: Add: `Local Biometric Authentication (FaceID/TouchID/Passcode) for Encrypted Vault folder protection & Secure Keyring Integration.`
  - **Layer 2 Details**: Update focus to: `Camera multi-photo scanning, Whisper offline STT audio recorder, Local TTS Audio Playback Engine (MVP offline speech synthesis), Quick Capture floating bar, Clipboard auto-detector, Background Session Manager (iOS Live Activities / Dynamic Island).`
  - **Layer 6 Details**: Update focus to: `PowerSync local-first SQLite-to-PostgreSQL streaming, Cloud Authentication (Supabase Auth / JWT / OAuth), Yjs CRDT WebSocket engine, zero-knowledge E2EE hash-fragment sharing (#key), Premium Cloud AI Voices (v3+ TTS), RevenueCat IAP billing.`

---

## 3. Change Specification for `03_sector_1_foundation_spec.md`

### 3.1 Gap Analysis
1. **Missing `capture_sessions` Table**: The background capture session state machine was described in Layer 2 text, but its database table specification was omitted from the Drizzle SQLite schema in `03_sector_1_foundation_spec.md`.
2. **Missing `parentPageId` in `pages` Table**: The `pages` schema lacked a `parent_page_id` self-referential foreign key required to support Notion-style nested sub-pages (`Nested Page-in-Page`).
3. **Missing 12 Block Payload JSON Schemas**: The `blocks` table stored `content: text('content', { mode: 'json' })`, but the explicit JSON payload TypeScript shapes for all 12 core block types were undefined.
4. **Daily Notes Implementation Ambiguity**: The query-level implementation for Daily Notes needed formal clarification regarding page identity vs cross-folder chronological aggregation.

### 3.2 Exact Change Specifications

#### Change 3.2.1: Add `capture_sessions` Table & `parentPageId` to Drizzle Schema
- **Target File**: `03_sector_1_foundation_spec.md`
- **Location**: Section 10 (`Complete Drizzle SQLite Schema Specification`)

**Updated `pages` Table Definition**:
```typescript
// Pages Table (Documents & Nested Sub-Pages)
export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(), // UUID v4
  folderId: text('folder_id').notNull().references(() => folders.id), // Enforces Zero-Orphans rule (Root container folder)
  parentPageId: text('parent_page_id').references(() => pages.id), // Self-reference for nested page-in-page hierarchy
  title: text('title').notNull(),
  icon: text('icon'), // Optional emoji or icon string
  coverImage: text('cover_image'), // Optional cover image path/URL
  isVault: integer('is_vault', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(), // ISO-8601
  updatedAt: text('updated_at').notNull(), // ISO-8601
});
```

**New `capture_sessions` Table Definition**:
```typescript
// Capture Sessions Table (Background Multi-Modal Session Lifecycle)
export const captureSessions = sqliteTable('capture_sessions', {
  id: text('id').primaryKey(), // UUID v4
  status: text('status').notNull(), // 'IDLE' | 'RECORDING' | 'PROCESSING' | 'SUGGESTION' | 'FILED' | 'CANCELLED'
  targetFolderId: text('target_folder_id').references(() => folders.id), // Resolved folder ID after confirmation
  targetPageId: text('target_page_id').references(() => pages.id), // Optional target page ID if inserting inline
  mediaType: text('media_type').notNull(), // 'photo' | 'multi_photo' | 'audio' | 'text' | 'clipboard' | 'screen'
  sessionData: text('session_data', { mode: 'json' }).notNull(), // JSON payload (paths, transcript, draft blocks)
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

#### Change 3.2.2: Define JSON Content Payload Shapes for ALL 12 Block Types
- **Target File**: `03_sector_1_foundation_spec.md`
- **Location**: Append to Section 10 as Section 10.1 (`JSON Content Payload Schemas for 12 Core Block Types`).

```typescript
// TypeScript Interfaces for All 12 Core Block Content JSON Payloads

export interface TextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: string | null;
  color?: string | null;
}

// 1. Paragraph Block
export interface ParagraphBlockContent {
  spans: TextSpan[];
}

// 2. Heading Block
export interface HeadingBlockContent {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  spans: TextSpan[];
  isCollapsed?: boolean; // Toggle heading support
}

// 3. To-Do Item Block
export interface TodoItemBlockContent {
  spans: TextSpan[];
  checked: boolean;
  dueDate: string | null; // ISO-8601 YYYY-MM-DD
  assignee?: string | null;
}

// 4. Toggle List Block
export interface ToggleListBlockContent {
  spans: TextSpan[];
  isExpanded: boolean;
}

// 5. Quote Block
export interface QuoteBlockContent {
  spans: TextSpan[];
  author?: string | null;
  icon?: string | null;
  color?: string | null;
}

// 6. Code Block
export interface CodeBlockContent {
  code: string;
  language: string; // e.g., 'typescript', 'python', 'json', 'sql'
  caption?: string | null;
  showLineNumbers?: boolean;
}

// 7. LaTeX Math Block
export interface LatexMathBlockContent {
  formula: string; // e.g., "E = mc^2"
  displayMode: boolean; // true = block formula, false = inline formula
}

// 8. Divider Block
export interface DividerBlockContent {
  style: 'solid' | 'dashed' | 'dotted';
}

// 9. Data Table Block
export interface DataTableBlockContent {
  headers: string[];
  rows: string[][];
  columnWidths?: number[];
  hasHeaderRow?: boolean;
}

// 10. Image Embed Block
export interface ImageEmbedBlockContent {
  url: string; // Local file URI or remote HTTPS URL
  caption?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

// 11. Nested Page-in-Page Link Block
export interface PageLinkBlockContent {
  targetPageId: string;
  title: string;
  icon?: string | null;
}

// 12. Infinite Canvas Embed Block
export interface CanvasEmbedBlockContent {
  canvasDataId: string; // References canvas stroke vector database record
  previewUrl?: string | null; // Cached thumbnail preview path
  height: number;
  readOnly: boolean;
}

// Discriminated Union for All Block Content Types
export type BlockContentPayload =
  | { type: 'paragraph'; content: ParagraphBlockContent }
  | { type: 'heading'; content: HeadingBlockContent }
  | { type: 'todo_item'; content: TodoItemBlockContent }
  | { type: 'toggle_list'; content: ToggleListBlockContent }
  | { type: 'quote'; content: QuoteBlockContent }
  | { type: 'code_block'; content: CodeBlockContent }
  | { type: 'latex_math'; content: LatexMathBlockContent }
  | { type: 'divider'; content: DividerBlockContent }
  | { type: 'data_table'; content: DataTableBlockContent }
  | { type: 'image_embed'; content: ImageEmbedBlockContent }
  | { type: 'page_link'; content: PageLinkBlockContent }
  | { type: 'canvas_embed'; content: CanvasEmbedBlockContent };
```

#### Change 3.2.3: Clarify Daily Notes Query-Level Implementation
- **Target File**: `03_sector_1_foundation_spec.md`
- **Location**: Section 7 (`Universal Date-Time Engine Architecture`)
- **Specification Text to Add**:

```markdown
### Query-Level Implementation for Daily Notes Engine

The Daily Notes system operates via a dual-layered database mechanism:

1. **Dedicated Daily Note Page Instance**:
   - Every calendar date `YYYY-MM-DD` has a dedicated `pages` table entry where `folder_id` matches the `Daily Notes` system anchor folder ID, and `title = 'YYYY-MM-DD'`.
   - On user navigation or background capture on date `D`, the system performs an `UPSERT` query to guarantee the existence of page `YYYY-MM-DD`.

2. **Cross-Folder Activity Aggregation Query**:
   - Opening the Daily Notes view executes a microsecond database query retrieving both direct daily journal blocks AND all external notes/captures created or modified on that date:

```sql
-- 1. Fetch Primary Daily Journal Page Blocks
SELECT b.* FROM blocks b
JOIN pages p ON b.page_id = p.id
WHERE p.folder_id = (SELECT id FROM folders WHERE is_system_anchor = 1 AND name = 'Daily Notes')
  AND p.title = :target_date
ORDER BY b.order_index ASC;

-- 2. Fetch Cross-Folder Captures Created on Target Date
SELECT p.id, p.title, p.folder_id, f.name as folder_name, p.created_at
FROM pages p
JOIN folders f ON p.folder_id = f.id
WHERE p.created_at LIKE :target_date_prefix || '%'
  AND p.is_vault = 0
ORDER BY p.created_at ASC;
```

3. **Required Database Indexes**:
   - `CREATE INDEX idx_pages_daily_lookup ON pages(folder_id, title);`
   - `CREATE INDEX idx_pages_created_at ON pages(created_at);`
   - `CREATE INDEX idx_blocks_created_at ON blocks(created_at);`
```

---

## 4. Change Specification for `04_tech_stack_and_dependencies.md`

### 4.1 Gap Analysis
`04_tech_stack_and_dependencies.md` previously only contained 9 foundation/mobile runtime packages. It required the addition of the 12 missing architectural dependencies with verified July 2026 version numbers, without modifying existing entries.

### 4.2 Exact Change Specifications
Add the following 6 sections (Sections 3 through 8) to `04_tech_stack_and_dependencies.md`:

```markdown
## 3. Local Data & Storage Engine

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **High-Speed SQLite JSI** | **`@op-engineering/op-sqlite`** | `v10.3.x` | Direct C++ JSI bindings to SQLite engine. Executes microsecond queries 10x-20x faster than standard async bridges. |
| **Type-Safe ORM** | **`drizzle-orm` & `drizzle-kit`** | `v0.38.x` | TypeScript ORM running across React Native (`op-sqlite`) and Next.js (`pg`). |

## 4. On-Device AI & Intelligence Pipeline

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Vector Embeddings Execution** | **`onnxruntime-react-native`** | `v1.20.x` | Hardware-accelerated ONNX runtime executing `all-MiniLM-L6-v2` 384-dim embeddings directly on iOS (CoreML) and Android (NNAPI). |
| **Offline Audio Speech-to-Text** | **`whisper.rn`** | `v1.8.x` | React Native binding for OpenAI Whisper (C++ `whisper.cpp`), delivering fully offline voice recording transcription. |

## 5. Rich Text Editor & Math Rendering Engine

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Notion-Grade Block Editor** | **`@tiptap/react` & `@tiptap/core`** | `v2.11.x` | ProseMirror-based headless block editor engine. Powering web native editor and WebView mobile bridge. |
| **LaTeX Formula Rendering** | **`katex` & `react-native-katex`** | `v0.16.x` | High-performance KaTeX math formula parsing and visual block rendering. |

## 6. GPU Graphics, Canvas & PDF Engine

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **GPU Drawing Canvas** | **`@shopify/react-native-skia`** | `v1.5.x` | 60FPS GPU Skia drawing engine for infinite canvas and freehand stylus input. |
| **PDF Viewing & Highlighting** | **`react-native-pdf` & `pdfjs-dist`** | `v6.7.x` / `v4.10.x` | Multi-page PDF viewport renderer, text extraction layer, and highlight annotation tracker. |

## 7. Cloud Sync, CRDT & Security Infrastructure

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Local-First Cloud Relay** | **`@powersync/react-native`** | `v1.8.x` | Local SQLite-to-Cloud PostgreSQL WebSocket streaming sync engine. |
| **Real-Time CRDT Engine** | **`yjs` & `y-websocket`** | `v13.6.x` / `v0.2.x` | Shared document CRDT timeline merge algorithm for real-time multiplayer collaboration. |
| **Hardware Vault Security** | **`react-native-keychain` & `expo-local-authentication`** | `v9.0.x` / `v15.x` | AES-256 Keychain/Keystore hardware enclave storage and FaceID/TouchID biometric unlock handler. |

## 8. Algorithms & Monetization SDKs

| Domain | Library / Package | Verified Current Version (Jul 2026) | Notes |
| :--- | :--- | :--- | :--- |
| **Spaced Repetition Scheduler** | **`ts-fsrs`** | `v5.0.x` | Free Spaced Repetition Scheduler algorithm engine calculating memory stability and flashcard review intervals. |
| **In-App Billing & Subscriptions** | **`react-native-purchases`** | `v8.5.x` | RevenueCat SDK managing Apple App Store / Google Play In-App Purchases, free trial state, and Pro subscriptions. |
```

---

## 5. Verification Plan

1. **Schema Integrity**:
   - Verify that all table definitions in `03_sector_1_foundation_spec.md` (`folders`, `pages`, `blocks`, `capture_sessions`, `folder_vectors`, `page_vectors`, `tags`, `page_tags`) compile cleanly under TypeScript `v6.0.x` and `drizzle-orm` `v0.38.x`.
   - Confirm that `parent_page_id` references `pages.id` correctly and `folder_id` remains `notNull()` to strictly satisfy the Zero-Orphans rule.

2. **Block JSON Schema Validation**:
   - Ensure all 12 block type payloads cover every requirement specified in `01_original_feature_list.md` (e.g. KaTeX math formulas, code block syntax highlighting, canvas embeds, data tables, page links).

3. **Roadmap & File Numbering Alignment**:
   - Cross-check file numbers 01 through 09 across the entire project root:
     - `01_original_feature_list.md`
     - `02_system_layers_roadmap.md`
     - `03_sector_1_foundation_spec.md`
     - `04_tech_stack_and_dependencies.md`
     - `05_sector_2_capture_spec.md`
     - `06_sector_3_editor_spec.md`
     - `07_sector_4_ai_flashcards_spec.md`
     - `08_sector_5_canvas_pdf_spec.md`
     - `09_sector_6_sync_collaboration_monetization_spec.md`

---

## 6. Summary of Actionable Implementation Tasks

| File | Target Section | Change Type | Summary of Action |
| :--- | :--- | :--- | :--- |
| `01_original_feature_list.md` | `Capture & Input` | Priority Bump | Update Session Continuation from `[v2]` to `[MVP]`. |
| `01_original_feature_list.md` | Post-Monetization | Addition | Add `### Accessibility & Localization` section with 8 features (MVP, v2, v3+). |
| `02_system_layers_roadmap.md` | Deliverable Files | Numbering Fix | Re-number sector spec deliverables to `05_sector_2`, `06_sector_3`, `07_sector_4`, `08_sector_5`, `09_sector_6`. |
| `02_system_layers_roadmap.md` | Layer 1, 2, 6 Descriptions | Clarification | Add Vault/Local Auth to Layer 1, Local TTS to Layer 2 (MVP), Cloud Auth to Layer 6. |
| `03_sector_1_foundation_spec.md` | Drizzle Schema | Schema Extension | Add `capture_sessions` table and `parent_page_id` column to `pages`. |
| `03_sector_1_foundation_spec.md` | Section 10.1 | Interface Spec | Add TypeScript interfaces for all 12 block JSON content payload shapes. |
| `03_sector_1_foundation_spec.md` | Section 7 | Query Spec | Add SQL queries and indexing spec for Daily Notes engine. |
| `04_tech_stack_and_dependencies.md` | Sections 3–8 | Dependency Addition | Add 12 missing packages across 6 domain tables with Jul 2026 version tags. |
