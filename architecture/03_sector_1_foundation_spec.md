# Noteee: Sector 1 - Foundational Data Hierarchy & Decoupled Architecture

## 1. Core Hierarchy & Tree Model

Noteee relies on a unified, recursive tree structure where every entity belongs to a parent container.

```
[ Root Workspace (Virtual Top Container: parent_id = NULL) ]
       │
       ├── 📁 System Anchors (Miscellaneous, Daily Journal, Encrypted Vault, etc.)
       │
       └── 📁 User Folder Node (ParentID: null, Path: "/courses")
             │
             ├── 📁 Subfolder Node (ParentID: "folder-1", Path: "/courses/cs101")
             │     │
             │     └── 📄 Page Node (ParentID: "subfolder-1", Title: "Lecture 1")
             │           │
             │           ├── 🧱 Block 1 (Type: Heading, Content: "Intro to Algorithms")
             │           ├── 🧱 Block 2 (Type: Paragraph, Content: "Big O notation...")
             │           └── 📄 Sub-page Block (Type: Page, TargetID: "page-2")
             │
             └── 🏷️ Independent Tags (Flat Many-to-Many: #cs, #exam, #important)
```

### What is the "Root"?
- **The Root Workspace** is the virtual top-level container of the entire Noteee database (represented by `parent_id = NULL`).
- The Root itself is **not a file or page**—it is the invisible workspace ceiling. All top-level Folders and System Anchors reside directly under Root.
- **Zero-Orphans Rule:** Pages (notes) are **never** allowed to float loosely under the Root workspace without a parent container. Every Page must reside inside a Folder, Subfolder, or another Page.

### Loose Page Routing Rules (3 AI Placement Pathways):
When a new note is captured or created, it follows one of 3 pathways:
1. **Fallback / "Place Later":** User selects "Place Later" (or AI confidence is low) $\rightarrow$ Note routes directly to the **`Miscellaneous`** system folder.
2. **AI Existing Folder/Page Suggestion:** AI calculates vector similarity $\rightarrow$ Suggests inserting the note into 2–3 existing folders or as a sub-section inside an existing document.
3. **AI New Branch Creation Suggestion:** If the note's semantic topic is entirely new and does not fit any existing folder (similarity score $< 60\%$), the AI prompts: *"New topic detected: 'Quantum Physics'. Create a new folder branch under '/Academics/Physics'?"*

---

## 2. Decoupled Architecture & Hybrid Multi-Device Sync Strategy

To ensure Noteee runs seamlessly across single native devices (offline SQLite), multiple native devices (iPhone, iPad, Mac laptop), and future Web applications (Next.js), the system is strictly decoupled using the **Dependency Inversion Principle (DIP)**.

```
                                  ┌─────────────────────────────┐
                                  │   React Native / Web UI     │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ INoteRepository (Interface) │
                                  └──────────────┬──────────────┘
                                                 │
                 ┌───────────────────────────────┴───────────────────────────────┐
                 ▼                                                               ▼
  ┌─────────────────────────────┐                                 ┌─────────────────────────────┐
  │   SQLiteNoteRepository      │                                 │   PowerSyncCloudRepository  │
  │   (Local Mobile / Offline)  │                                 │   (Multi-Device / Web Sync) │
  └─────────────────────────────┘                                 └─────────────────────────────┘
```

### Dual-Layered Hybrid Multi-Device Sync (Cloud WebSocket + Local LAN P2P):
Noteee combines **Local-First Cloud WebSocket Sync** with **Optional Local LAN Peer-to-Peer (P2P) Sync** to give users the absolute fastest experience across any network:

```
                               ┌───────────────────────────┐
                               │   Noteee Client (Mobile)  │
                               └─────────────┬─────────────┘
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             ▼                                                               ▼
┌──────────────────────────┐                                    ┌──────────────────────────┐
│ Primary: Cloud Sync      │                                    │ Secondary: Local LAN P2P │
│ - PowerSync + WebSockets │                                    │ - Local Wi-Fi Discovery  │
│ - Works over 5G/Internet │                                    │ - Zero internet bandwidth │
│ - Instant 100ms sync     │                                    │ - Ultra-fast multi-MB    │
│ - Connects to PostgreSQL │                                    │   media transfers        │
└──────────────────────────┘                                    └──────────────────────────┘
```

1. **Primary Cloud Sync (PowerSync + WebSockets):** Writes to local SQLite in **$< 3\text{ms}$**, then streams tiny JSON patches over WebSockets to Cloud PostgreSQL. Syncs across iPhone, iPad, Mac, and Web in **$< 100\text{ms}$** regardless of distance or cellular network.
2. **Secondary Local LAN Sync (Optional Local Wi-Fi P2P):** When two devices are on the exact same local Wi-Fi network, Noteee can optional stream large media files (e.g. 500MB PDFs or raw audio recordings) directly between devices over local Wi-Fi without consuming cellular internet bandwidth!
3. **Block-Level CRDT Conflict Resolution:** Offline edits on separate devices are resolved cleanly using block-level timestamp CRDT timeline merges.
4. **Future Web Compatibility:** The Next.js Web App connects directly to the exact same Cloud PostgreSQL database via Drizzle ORM. Zero backend rewrites needed when launching Web!

---

## 3. Hybrid Vector DB & Semantic Search Architecture

Vector search is decoupled to support local offline embedding execution alongside cloud multi-device vector synchronization.

```
                               ┌──────────────────────────────────┐
                               │  IVectorSearchEngine (Interface) │
                               └────────────────┬─────────────────┘
                                                │
             ┌──────────────────────────────────┴──────────────────────────────────┐
             ▼                                                                     ▼
┌──────────────────────────┐                                          ┌──────────────────────────┐
│ LocalSQLiteVectorEngine  │                                          │ CloudPgVectorEngine      │
│ - Runs all-MiniLM-L6-v2  │                                          │ - PostgreSQL `pgvector`  │
│   locally via ONNX       │                                          │   cloud extension        │
│ - Stores vectors in local│                                          │ - Syncs vector arrays    │
│   SQLite vector tables   │                                          │   across all devices     │
└──────────────────────────┘                                          └──────────────────────────┘
```

- **Local Generation:** On mobile/desktop apps, `all-MiniLM-L6-v2` generates 384-dimensional float vector embeddings on-device and stores them in SQLite (`folder_vectors`, `page_vectors`).
- **Cloud Vector Sync:** PowerSync syncs vector arrays to Cloud PostgreSQL `pgvector`.
- **Web App Parity:** Notes created on the Web app have embeddings generated via cloud AI and synced down to mobile local SQLite vector tables automatically.

---

## 4. Notion Architecture Comparison: What We Kept vs. Improved

| Architectural Feature | Notion's Model | Noteee's Model (Sector 1) | Noteee Strategic Advantage |
| :--- | :--- | :--- | :--- |
| **Data Unit** | Recursive Block Engine | Recursive Block Engine | Identical JSON schema identity; blocks nest infinitely. |
| **Workspace Ceiling** | Loose pages allowed at root | Virtual Root Ceiling (`parent_id = NULL`) | **Zero Orphans:** Eliminates clutter; unfiled notes route to `Miscellaneous`. |
| **System Anchors** | Manually built by user | **Atomic Anchors + Smart Hubs** | Pre-structured home on Day 1 for tasks, daily logs, vault, and media. |
| **Time System** | Isolated calendar database | **Universal Date-Time Axis** | Every block edit populates a dynamic `YYYY-MM-DD` daily journal timeline. |
| **Organization** | 100% manual drag-and-drop | **AI Hybrid Filing** | 1-Tap AI placement, new branch creation prompts, and flat auto-tagging. |

---

## 5. Technology Rationale & Block JSON Types Schema: Drizzle ORM & Local SQLite Engine

### Why SQLite?
1. **100% Offline-First Speed:** User notes, folders, and blocks read and write instantly on the device with **0ms network latency**.
2. **Microsecond JSI Performance:** Through `@op-engineering/op-sqlite`, JavaScript communicates with SQLite via C++ Direct JSI Bindings (JavaScript Interface), executing queries **10x–20x faster** than standard mobile storage (AsyncStore / Realm).
3. **Hardware-Level Encryption:** The SQLite database file (`noteee.db`) can be encrypted at rest (AES-256) via iOS Keychain and Android Keystore hardware enclaves.
4. **Local-First Cloud Sync (PowerSync):** SQLite syncs seamlessly with PostgreSQL in the cloud when connected to the internet.

### Why Drizzle ORM?
- **TypeScript Type Safety:** Catches database column errors during compilation.
- **Zero Overhead:** Compiles straight to clean SQL without heavy runtime magic.
- **Cross-Platform Parity:** Runs identically on React Native mobile (`@op-engineering/op-sqlite`) and Next.js web (`PostgreSQL`).

---

## 6. Atomic Anchors & System Features Specification

Noteee strictly distinguishes between **System Features** (built-in app views/feeds) and **Atomic Anchors** (specialized, queryable block containers in the workspace tree).

### A. System Features (Built-in App Views / Feeds):
- 🔔 **Inbox & Activity Feed:** Read-only log of AI auto-filing actions, confirmations, and system notifications.
- ✅ **To-Do & Planner:** Centralized task manager aggregating all `@date` task blocks across all pages.
- 🃏 **Flashcards Deck:** Spaced repetition review interface powered by the FSRS algorithm.

### B. Atomic Anchors (Configurable Block Containers):
Anchors are atomic, queryable containers that compile specific block types across the entire workspace:

| Icon | Atomic Anchor | Primary Query Target | Purpose & Behavior |
| :---: | :--- | :--- | :--- |
| 📥 | **`Miscellaneous Anchor`** | Mandatory Fallback | Default fallback for unfiled notes & "Place Later" captures (Zero Orphans!). |
| 📅 | **`Daily Journal Anchor`** | `YYYY-MM-DD` Timeline | Compiles all blocks created/edited on date `YYYY-MM-DD`. |
| 💡 | **`Ideas Anchor`** | Unstructured Notes | Rapid capture bucket for quick rants, audio clips, and spontaneous thoughts. |
| 🔒 | **`Encrypted Vault Anchor`** | Sensitive Blocks | AES-256 encrypted container requiring biometric unlock (FaceID/TouchID/Passcode). |
| 🖼️ | **`Image Anchor`** | `image` Blocks | Atomic gallery compiling all whiteboard photos, screenshots, and diagrams. |
| 🎙️ | **`Audio Anchor`** | `audio` Blocks | Atomic playlist compiling all voice recordings & Whisper transcripts. |
| 📄 | **`PDF Anchor`** | `pdf` Blocks | Atomic library compiling all attached/imported PDF documents & annotations. |
| 🌐 | **`Web Clips & Links Anchor`** | `subpage_link` / URLs | Atomic bookmark manager compiling all saved web clips, articles, and link blocks. |
| 📌 | **`Favorites Anchor`** | Pinned Records | Quick-access container for pinned pages and active project shortcuts. |

### C. Smart Media & Resource Hub (Intelligent Higher-Level Grouping):
To avoid sidebar clutter, Noteee intelligently groups the atomic media anchors (`Image`, `Audio`, `PDF`, `Web Clips`) under a master **Media & Resource Hub** dropdown view on the sidebar:

```
[ Sidebar Workspace Tree ]
  ├── 📥 Miscellaneous Anchor
  ├── 📅 Daily Journal Anchor
  ├── 🔒 Encrypted Vault Anchor
  └── 📂 Smart Media Hub (Master Container)
        ├── 🖼️ Image Gallery
        ├── 🎙️ Audio Library
        ├── 📄 PDF Documents
        └── 🌐 Web Clips & Links
```

### D. User Settings & Onboarding Customization:
- **User Control:** Users can enable or disable any **Anchor** during onboarding chat or anytime in **Settings ➔ Anchors**. (`Miscellaneous Anchor` remains enabled by default to enforce Zero-Orphans).
- **AI Contextual Prompts:** If an Anchor is disabled, Noteee AI gently prompts the user when usage patterns fit: *"You have captured 15 audio recordings this week. Enable the 'Audio Anchor' in Settings for instant playback?"*

---

## 7. Universal Date-Time Engine Architecture

Time is treated as a **first-class system axis** across Noteee.

```
                           ┌────────────────────────────────────────┐
                           │      UNIVERSAL DATE-TIME SYSTEM       │
                           └──────────────────┬─────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
 📅 Daily Log Page                    ✅ To-Do Engine                      📊 Timeline Audit
 (e.g. 2026-07-26)                     (Task Aggregator)                   (Search & History)
 Auto-collects all captures,           Maps tasks tagged with              Retrieves notes/captures
 notes, and blocks created             dates; triggers alerts &            chronologically across
 on this date in order.                due-date scheduling.                all folders.
```

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

---

## 8. Onboarding AI Companion & Interactive Tree Visualizer

### Local AI Onboarding Workflow:
- **Interactive Orientation Chat:** During first launch, an on-device quantized LLM chats with the user to understand their specific needs and goals.
- **Template Matching & User Proposal:** The AI evaluates pre-built folder templates (e.g., *Student*, *Academic*, *Software Engineer*, *Personal Productivity*) against the user's responses. It presents the best-matching template visual tree and explicitly asks: *"Here is a suggested tree for your studies. Would you like to use this, or add/remove branches?"*
- **Mandatory System Anchors:** Regardless of template customization, core Anchors like `Miscellaneous Anchor` are automatically injected into every user's tree structure as system hubs.

### Interactive Tree Visualizer & Re-organizer (Option B):
- **UI Design:** A full-screen expandable File Explorer sidebar with clean indentation, collapse/expand arrows, search filtering, and drag-and-drop reordering.
- **AI Re-organization Guidance:** When users move folders or pages, the local AI provides lightweight feedback (e.g. *"Moving 'Linear Algebra' under 'Math 101' improves search matching."*) while guaranteeing search indexes remain fully functional regardless of location.

---

## 9. Encrypted Vault Folder Specification

- **Visual State:** Displayed in the tree with a prominent lock icon 🔒.
- **Security Protocols:** Folder metadata and block contents inside the vault are encrypted using AES-GCM-256 via iOS Keychain / Android Keystore hardware enclaves.
- **Auto-Lock Timeout:** Configurable auto-lock triggers when leaving the Vault view or after 1 minute of app inactivity.
- **Automated Sensitive Data Routing:** Local AI scans capture sessions for structured credentials (API keys, passwords, credit card patterns) and offers 1-tap auto-routing into the Vault.

---

## 10. Complete Drizzle SQLite Schema Specification

```typescript
import { sqliteTable, text, real, integer, blob } from 'drizzle-orm/sqlite-core';

// Folders Table (Tree Hierarchy)
export const folders = sqliteTable('folders', {
  id: text('id').primaryKey(), // UUID
  parentId: text('parent_id'), // Nullable: null = sits directly under virtual Root Workspace
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  path: text('path').notNull(), // Materialized path e.g. "/academics/cs101"
  isSystemAnchor: integer('is_system_anchor', { mode: 'boolean' }).default(false),
  isVault: integer('is_vault', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

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

// Blocks Table (Notion-Style Recursive Composite Pattern)
export const blocks = sqliteTable('blocks', {
  id: text('id').primaryKey(), // UUID
  pageId: text('page_id').notNull().references(() => pages.id),
  parentBlockId: text('parent_block_id'), // Nullable self-reference for nested toggles/quotes
  type: text('type').notNull(), // 'paragraph', 'heading_1', 'heading_2', 'heading_3', 'todo_item', 'toggle', 'callout', 'code_block', 'latex_math', 'image', 'audio', 'subpage_link', 'canvas_embed', 'flashcard_cloze'
  orderIndex: real('order_index').notNull(), // Fractional indexing for fluid drag & drop
  content: text('content', { mode: 'json' }).notNull(), // Payload JSON object
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Folder Vector Embeddings Table (Local On-Device AI Auto-Filing Engine)
export const folderVectors = sqliteTable('folder_vectors', {
  folderId: text('folder_id').primaryKey().references(() => folders.id),
  embedding: blob('embedding').notNull(), // 384-dimensional float vector array (all-MiniLM-L6-v2)
  updatedAt: text('updated_at').notNull(),
});

// Page Vector Embeddings Table (Semantic Search Engine)
export const pageVectors = sqliteTable('page_vectors', {
  pageId: text('page_id').primaryKey().references(() => pages.id),
  embedding: blob('embedding').notNull(), // 384-dimensional float vector array
  updatedAt: text('updated_at').notNull(),
});

// Tags Table (Flat Independent Tagging)
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull().unique(), // e.g. "math"
  color: text('color'),
});

// Page-Tags Junction Table (Many-to-Many)
export const pageTags = sqliteTable('page_tags', {
  id: text('id').primaryKey(), // Junction record UUID
  pageId: text('page_id').notNull().references(() => pages.id),
  tagId: text('tag_id').notNull().references(() => tags.id),
  isAutoTag: integer('is_auto_tag', { mode: 'boolean' }).default(false), // Visual AI badge indicator
});
```

---

## 10.1 JSON Content Payload Schemas for Core Block Types

```typescript
// TypeScript Interfaces for All Core Block Content JSON Payloads

export interface TextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: string | null;
  color?: string | null;
  backgroundColor?: string | null;
  math?: string | null;
}

// 1. Paragraph Block ('paragraph')
export interface ParagraphBlockContent {
  spans: TextSpan[];
}

// 2. Heading Blocks ('heading_1', 'heading_2', 'heading_3')
export interface Heading1BlockContent {
  level: 1;
  spans: TextSpan[];
  isCollapsed?: boolean;
}

export interface Heading2BlockContent {
  level: 2;
  spans: TextSpan[];
  isCollapsed?: boolean;
}

export interface Heading3BlockContent {
  level: 3;
  spans: TextSpan[];
  isCollapsed?: boolean;
}

// 3. To-Do Item Block ('todo_item')
export interface TodoItemBlockContent {
  spans: TextSpan[];
  checked: boolean;
  dueDate: string | null; // ISO-8601 YYYY-MM-DD
  assignee?: string | null;
}

// 4. Toggle List Block ('toggle')
export interface ToggleListBlockContent {
  spans: TextSpan[];
  isExpanded: boolean;
}

// 5. Callout Block ('callout')
export interface CalloutBlockContent {
  spans: TextSpan[];
  icon: string;
  color: 'info' | 'warning' | 'success' | 'error' | 'neutral';
  backgroundColor?: string | null;
}

// 6. Code Block ('code_block')
export interface CodeBlockContent {
  code: string;
  language: string; // e.g., 'typescript', 'python', 'json', 'sql'
  caption?: string | null;
  showLineNumbers?: boolean;
}

// 7. LaTeX Math Block ('latex_math')
export interface LatexMathBlockContent {
  formula: string; // e.g., "E = mc^2"
  displayMode: boolean; // true = block formula, false = inline formula
}

// 8. Image Embed Block ('image')
export interface ImageEmbedBlockContent {
  url: string; // Local file URI or remote HTTPS URL
  caption?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

// 9. Audio Player Block ('audio')
export interface AudioBlockContent {
  url: string;
  duration: number; // Audio duration in seconds
  transcript?: string | null;
  caption?: string | null;
  playbackSpeed?: number;
}

// 10. Sub-page Link Block ('subpage_link')
export interface SubpageLinkBlockContent {
  targetPageId: string;
  title: string;
  icon?: string | null;
}

// 11. Infinite Canvas Embed Block ('canvas_embed')
export interface CanvasEmbedBlockContent {
  canvasDataId: string; // References canvas stroke vector database record
  previewUrl?: string | null; // Cached thumbnail preview path
  height: number;
  readOnly: boolean;
}

// 12. Flashcard Cloze / Q&A Block ('flashcard_cloze')
export interface FlashcardClozeBlockContent {
  cardType: 'cloze' | 'qa';
  spans?: TextSpan[];
  frontText: string;
  backText?: string | null;
  deckCategory?: string | null;
  cardId?: string | null;
}
```
